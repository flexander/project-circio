import '../structure';
import {
    BrushInterface,
    PolygonInterface,
    EventEmitter,
    PositionInterface,
    ShapeStateInterface,
    PolygonSasInterface,
    CircleConfigInterface,
    PolygonConfigInterface
} from "../structure";
import * as math from 'mathjs';
import {CircleConfig, CircleConfigDefault} from "./circle";

const cloneDeep = require('lodash.clonedeep');

class Polygon extends EventEmitter implements PolygonInterface {
    brushes: BrushInterface[] = [];
    clockwise: boolean;
    fixed: boolean;
    id: number;
    outside: boolean;
    radius: number;
    startAngle: number;
    state: ShapeStateInterface = new PolygonState();
    stepMod: number;
    steps: number;
    isRoot: boolean;
    faces: number;
    faceWidth: number;
    modified: boolean;
    parent?: PolygonInterface;
    protected config: PolygonConfig = new PolygonConfig();

    constructor() {
        super();

        this.id = Math.floor(Math.random()*100000);

        this.saveInitialState();
    }

    calculatePosition(parentPolygon: PolygonInterface|null): void {
        this.savePreviousState();

        let arcToParentRadians = 0;
        let parentRadians = (parentPolygon !== null && this.fixed === true) ? parentPolygon.state.totalAngle: 0;
        let radiusRelative = 0;
        let parentCentreX = this.state.centre.x;
        let parentCentreY = this.state.centre.y;

        if (parentPolygon !== null) {
            this.parent = parentPolygon;
            parentCentreX = parentPolygon.state.centre.x;
            parentCentreY = parentPolygon.state.centre.y;

            this.getDistanceFromOriginToContact(parentPolygon);

            // calculate parent centre contact point
            const parentSAS = this.getValuesFromSAS(
                parentPolygon.getRadius(),                                  // side b
                (parentPolygon.getOuterAngle()/2),                          // angle A
                this.getDistanceFromParentCornerToContact(parentPolygon)    // side c
            );

            const parentCentreToContactPoint = parentSAS.a;
            const angleFromOrigin = parentPolygon.state.totalAngle + parentSAS.C;
            const angleRelativeToParent = 0; //this.getCornersPassed(parentPolygon) * parentPolygon.getInnerAngle();
            const contactPointX = (parentCentreToContactPoint * Math.cos(angleFromOrigin + angleRelativeToParent)) + parentCentreX;
            const contactPointY = (parentCentreToContactPoint * Math.sin(angleFromOrigin + angleRelativeToParent)) + parentCentreY;

            // calculate child centre contact point
            const childSAS = this.getValuesFromSAS(
                this.getRadius(),                                                   // side b
                (this.getOuterAngle()/2),                                           // angle A
                Math.abs(this.getDistanceFromChildCornerToContact(parentPolygon))   // side c
            );

            const childCentreToContactPoint = childSAS.a;
            // If parentSasC = 0 then the child is on a corner
            const parentSASB = (parentSAS.C !== 0) ? parentSAS.B : (parentPolygon.getOuterAngle() / 2);

            const relativeAngle = (
                // TODO: this calc might be wrong
                //(((this.state.totalAngle + this.getOffsetRadians(parentPolygon)) - (this.getCornersPassed(parentPolygon) * parentPolygon.getExternalAngle())) % this.getRadiansPerFace()) +
                childSAS.B +
                parentSASB
            );

            const relativeSAS = this.getValuesFromSAS(
                parentCentreToContactPoint,                 // side b
                relativeAngle,                              // angle A
                childCentreToContactPoint                   // side c
            );
            radiusRelative = relativeSAS.a;
            arcToParentRadians = (this.config.clockwise === true) ? -(relativeSAS.C) : relativeSAS.C;

            this.state.contactPoint.x = contactPointX;
            this.state.contactPoint.y = contactPointY;
        }
        this.state.centre.x = parentCentreX + (Math.cos(parentRadians + arcToParentRadians) * radiusRelative);
        this.state.centre.y = parentCentreY + (Math.sin(parentRadians + arcToParentRadians) * radiusRelative);

        // New x1 & y1 to reflect change in radians
        this.state.drawPoint.x = this.state.centre.x + (Math.cos(parentRadians + arcToParentRadians + this.state.totalAngle) * this.getRadius());
        this.state.drawPoint.y = this.state.centre.y + (Math.sin(parentRadians + arcToParentRadians + this.state.totalAngle) * this.getRadius());
    }
    public calculateAngle(): void {
        this.state.previousState.totalAngle = this.state.totalAngle;
        if (this.clockwise === true) {
            this.state.totalAngle += this.getStepRadians();
        } else {
            this.state.totalAngle -= this.getStepRadians();
        }
    }

    protected savePreviousState() {
        this.state.previousState = cloneDeep(this.state);
        delete this.state.previousState.previousState;
    }

    protected saveInitialState() {
        this.state.initialState = cloneDeep(this.state);
    }

    protected getStepRadians () {
        let stepRadian = 0;
        if(this.steps > 0) {
            stepRadian = (Math.PI*2)/this.steps;
        }

        return stepRadian;
    }

    protected getStepCount () {
        let stepCount = 0;
        if(this.steps > 0) {
            stepCount = this.state.totalAngle/this.getStepRadians();
        }

        return stepCount;
    }

    reset(): void {
        this.state = cloneDeep(this.state.initialState);

        // Create a new initial state object
        this.saveInitialState();
    }

    addBrush(brush: BrushInterface): void {
        this.brushes.push(brush);
    }

    getBrushes(): BrushInterface[] {
        return this.brushes;
    }

    getRadius(): number {
        return this.faceWidth / (2 * Math.sin(Math.PI / this.faces));
    }

    getInRadius(): number {
        return this.faceWidth / (2 * Math.tan(Math.PI / this.faces));
    }

    getInnerAngle(): number {
        return (2* Math.PI) / this.faces;
    }

    getOuterAngle(): number {
        return Math.PI - this.getInnerAngle();
    }

    getExternalAngle(): number {
        return this.getInnerAngle();
    }

    getRadiansPerFace(): number {
        return this.getInnerAngle();
    }

    getRatio(parentPolygon: PolygonInterface): math.Fraction {
        return <math.Fraction> math.fraction(parentPolygon.faceWidth, this.faceWidth);
    }

    /**
     * The angle between the active parent face and
     * active child face in the start position
     *
     * @param parentPolygon
     */
    getOffsetRadians(parentPolygon: PolygonInterface): number {
        let offsetAngle: number = 0;

        // Odd number of faces
        if (this.faces % 2 !== 0) {
            offsetAngle = (Math.PI - parentPolygon.getOuterAngle()) / 2;
        } else {
            offsetAngle = ((Math.PI * 2) - this.getOuterAngle() - parentPolygon.getOuterAngle()) / 2;
        }

        return offsetAngle;
    }

    /**
     * Returns the angle the shape has "already rolled" based
     * on its start position on the parent.
     *
     * @param parentPolygon
     */
    getInitialRadians(parentPolygon: PolygonInterface): number {
        // The angle between the active parent face and active child face
        let offsetAngle: number = this.getOffsetRadians(parentPolygon);

        return this.getExternalAngle() - offsetAngle;
    }

    getOffsetDistance(): number {
        let offset: number = this.faceWidth;

        if (this.faces % 2 !== 0) {
            offset /= 2;
        }

        return offset;
    }

    getSequenceGroupRadians(parentPolygon: PolygonInterface): number {
        const ratio: math.Fraction = this.getRatio(parentPolygon);

        const childFacesInGroup: number = ratio.n;
        const groupSize: number = ratio.d;

        const cornerRadians: number = parentPolygon.getExternalAngle() * groupSize;
        const faceRadians: number = this.getRadiansPerFace() * childFacesInGroup;

        return cornerRadians + faceRadians;
    }

    getSequenceGroup(parentPolygon: PolygonInterface): number {
        return math.floor(this.state.totalAngle / this.getSequenceGroupRadians(parentPolygon));
    }

    getSequence(parentPolygon: PolygonInterface): number[] {
        const ratio: math.Fraction = this.getRatio(parentPolygon);
        const sequence: number[] = [];
        const maxValue = math.ceil(math.number(ratio));
        const offset: number = this.getOffsetDistance();

        let offsetDistance: number = offset;

        for (let parentIndex = 0; parentIndex < ratio.d; parentIndex++) {
            for (let childIndex = 0; childIndex <= maxValue; childIndex++) {
                const distance = offsetDistance + (childIndex * this.faceWidth);
                if (distance > ((parentIndex + 1) * parentPolygon.faceWidth)) {
                    sequence.push(childIndex);
                    const sequenceSum = sequence.reduce((sum, value) => { return sum + value}, 0);
                    offsetDistance = offset + (sequenceSum * this.faceWidth);

                    break;
                }
            }
        }

        return sequence;
    }

    getCornersPassed(parentPolygon: PolygonInterface): number {
        const cornersPassed = 0;

        const sequence = this.getSequence(parentPolygon);

        return cornersPassed;
    }

    getDistanceFromOriginToContact(parentPolygon: PolygonInterface): number {
        const offsetRadians = this.getOffsetRadians(parentPolygon);
        const sequence = this.getSequence(parentPolygon);
        const ratio: math.Fraction = this.getRatio(parentPolygon);
        const totalAngle = this.state.totalAngle - offsetRadians;

        // Normalise position
        if (totalAngle < 0) {
            return 0;
        }

        // Find the active group
        const sequenceGroup: number = this.getSequenceGroup(parentPolygon);
        const offsetGroupRadians: number = sequenceGroup * this.getSequenceGroupRadians(parentPolygon);
        const radiansRelativeToGroup: number = totalAngle - (offsetGroupRadians);

        // Find the active parent face (relative to the group) in the sequence
        let parentActiveFace: number;
        let childFacesRolled: number = 0;
        for (parentActiveFace = 0; parentActiveFace < sequence.length; parentActiveFace++) {
            childFacesRolled += sequence[parentActiveFace];
            const radiansRolled: number = (childFacesRolled * this.getRadiansPerFace());
            const cornerRads: number = parentPolygon.getExternalAngle() * (parentActiveFace + 1);

            if ((radiansRelativeToGroup - (radiansRolled + cornerRads)) < 0) {
                break;
            }
        }

        //Find the active child face (relative to the PAF) in the sequence
        const childRolls: number[] = sequence.slice(0, parentActiveFace);
        const childRollsSum: number = childRolls.reduce((sum, value) => { return sum + value}, 0);
        const childRollsRads: number = childRollsSum * this.getRadiansPerFace();
        const cornerRads: number = parentPolygon.getExternalAngle() * parentActiveFace;
        const radiansRelativeToPaf: number = radiansRelativeToGroup - (childRollsRads + cornerRads);

        let childActiveFace: number;
        for (childActiveFace = 0; childActiveFace <= sequence[parentActiveFace]; childActiveFace++) {
            if ((radiansRelativeToPaf - ((childActiveFace + 1) * this.getRadiansPerFace())) < 0) {
                break;
            }
        }

        // If on corner, distance is multiple of PF
        let onCorner = false;
        if ((sequence[parentActiveFace] * this.getRadiansPerFace()) - radiansRelativeToPaf) {
            onCorner = true;
        }

        // If not on corner, distance is multiple of CF

        const distance: number = 0;

        const currentChildFace: number = (ratio.n * sequenceGroup) + childRollsSum + childActiveFace;
        const fixedStyle = 'font-weight: bold; color: cyan; background: black;';
        const stateStyle = 'font-weight: bold; color: orange; background: black;';

        console.log('----> %c' + currentChildFace + ' : ' + Math.round(totalAngle/this.getStepRadians()) + '%c <----',
            'font-weight: bold; color: red; background: black;',
            'font-weight: normal; color: inherit;'
        );
        console.log('---------------');
            console.log('C faces: %c' + this.faces, fixedStyle);
            console.log('P faces: %c' + parentPolygon.faces, fixedStyle);
            console.log('sequence: %c' + sequence, fixedStyle);
            //console.log('radiansPerFace: %c' + this.getRadiansPerFace(), fixedStyle);
            //console.log('stepRadians: %c' + this.getStepRadians(), fixedStyle);
            //console.log('offset: %c' + offsetRadians, fixedStyle);

        console.log('- - - - - - -');
            console.log('totalAngle:  %c' + totalAngle, stateStyle);
            console.log('sequenceGroup:  %c' + sequenceGroup, stateStyle);
            //console.log('radiansRelativeToGroup:  %c' + radiansRelativeToGroup, stateStyle);
            //console.log('offsetGroupRadians:  %c' + offsetGroupRadians, stateStyle);
            console.log('parentActiveFace:  %c' + parentActiveFace, stateStyle);
        console.log('- - - - - - -');
            //console.log('childRolls:  %c' + childRolls, stateStyle);
            console.log('onCorner:  %c' + onCorner, stateStyle);
            console.log('childRollsSum:  %c' + childRollsSum, stateStyle);
            //console.log('radiansRelativeToPaf:  %c' + radiansRelativeToPaf, stateStyle);
            console.log('childActiveFace:  %c' + childActiveFace, stateStyle);
        console.log('---------------');

        return distance;
    }

    getParentDistanceFromOriginToContact(parentPolygon: PolygonInterface): number {
        return 0;
    }

    getDistanceFromParentCornerToContact(parentPolygon: PolygonInterface): number {
        const cornersPassed = this.getCornersPassed(parentPolygon);

        return 0;
    }

    getDistanceFromChildCornerToContact(parentPolygon: PolygonInterface): number {
        return 0;
    }

    // Calculate values of a triangle where we know two sides and the angle between them
    public getValuesFromSAS(sideB: number, angleA: number, sideC: number): PolygonSasInterface {

        let sideA: number; // a
        let angleB: number; // B
        let angleC: number; // C

        // a^2 = b^2 + c^2 − 2bc cosA
        sideA = Math.sqrt(Math.pow(sideB, 2) + Math.pow(sideC, 2) - (2 * sideB * sideC * Math.cos(angleA)));

        const smallAngle: number = Math.asin( (Math.sin(angleA)*Math.min(sideB, sideC)) / sideA );
        const largeAngle: number = Math.PI - smallAngle - angleA;

        if (sideB < sideC) {
            angleB = smallAngle;
            angleC = largeAngle;
        } else {
            angleC = smallAngle;
            angleB = largeAngle;
        }

        const polygonSas: PolygonSasInterface = new PolygonSas();
        polygonSas.a = sideA;
        polygonSas.b = sideB;
        polygonSas.c = sideC;
        polygonSas.A = angleA;
        polygonSas.B = angleB;
        polygonSas.C = angleC;

        return polygonSas;
    }
}

class PolygonState implements ShapeStateInterface {
    centre: PositionInterface = new PolygonCenterPosition();
    drawPoint: PositionInterface = new PolygonDrawPosition();
    contactPoint: PositionInterface = new PolygonContactPosition();
    initialState: ShapeStateInterface = Object.create(this);
    previousState: ShapeStateInterface = null;
    totalAngle: number = 0;

    public getAngle(): number {
        return Math.atan2(
            (this.drawPoint.y - this.centre.y), // Delta Y
            (this.drawPoint.x - this.centre.x) // Delta X
        );
    }
}

class PolygonCenterPosition implements PositionInterface {
    x: number = 0;
    y: number = 0;
}

class PolygonDrawPosition implements PositionInterface {
    x: number;
    y: number;
}

class PolygonContactPosition implements PositionInterface {
    x: number;
    y: number;
}

class PolygonSas implements PolygonSasInterface {
    a: number;
    b: number;
    c: number;
    A: number;
    B: number;
    C: number;
}

class PolygonConfigDefault implements PolygonConfigInterface {
    steps: number = 500;
    outside: boolean = true;
    fixed: boolean = true;
    clockwise: boolean = true;
    stepMod: number = 0;
    startAngle: number = 0;
    isRoot: boolean = false;
    modified: boolean;
    faceWidth: number;
    faces: number;

    constructor() {
        if (new.target === CircleConfigDefault) {
            Object.freeze(this);
        }
    }
}

class PolygonConfig extends PolygonConfigDefault implements PolygonConfigInterface {
}

export {
    Polygon,
    PolygonState,
    PolygonCenterPosition,
    PolygonDrawPosition,
}
