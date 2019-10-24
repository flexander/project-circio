import '../structure';
import {
    BrushInterface,
    PolygonInterface,
    EventEmitter,
    PositionInterface,
    ShapeStateInterface,
    PolygonSasInterface, CircleConfigInterface, PolygonConfigInterface
} from "../structure";
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

    getFacesPerParentFace(parentPolygon: PolygonInterface): number {
        return Math.ceil(parentPolygon.faceWidth / this.faceWidth);
    }

    getRadiansPerParentFace(parentPolygon: PolygonInterface): number {
        return this.getInnerAngle() * this.getFacesPerParentFace(parentPolygon);
    }

    getOffsetRadians(parentPolygon: PolygonInterface): number {
        // The angle between the active parent face and active child face
        let initialAngle = 0;

        if (this.faces % 2 !== 0) {
            initialAngle = (Math.PI - parentPolygon.getOuterAngle()) / 2;
        } else {
            initialAngle = ((Math.PI * 2) - this.getOuterAngle() + parentPolygon.getOuterAngle()) / 2;
        }

        return this.getExternalAngle() - initialAngle;
    }

    getOffsetDistance(): number {
        let offset = 0;

        if(this.faces % 2 !== 0) {
            offset = this.faceWidth / 2;
        }

        return offset;
    }

    getDistanceFromOriginToContact(parentPolygon: PolygonInterface): number {
        return 0;
    }

    getParentDistanceFromOriginToContact(parentPolygon: PolygonInterface): number {
        return 0;
    }

    getDistanceFromParentCornerToContact(parentPolygon: PolygonInterface): number {
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
