import '../structure';
import {
    BrushInterface,
    PolygonInterface,
    EventEmitter,
    PositionInterface,
    ShapeStateInterface,
    PolygonSasInterface
} from "../structure";
import {AttributeChangedEvent} from "./events";
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

    constructor() {
        super();

        this.id = Math.floor(Math.random()*100000);

        this.saveInitialState();
    }

    calculatePosition(parentPolygon: PolygonInterface|null): void {
        this.savePreviousState();

        let arcToParentRadians = 0;
        let parentRadians = parentPolygon !== null && this.fixed === true ? parentPolygon.state.getAngle():0;
        let radiusRelative = 0;
        let parentCentreX = this.state.centre.x;
        let parentCentreY = this.state.centre.y;

        if (parentPolygon !== null) {
            // TODO: calculate contact point
            const parentSAS = this.getValuesFromSAS(
                parentPolygon.getRadius(),                      // b
                (parentPolygon.getOuterAngle()/2),              // A
                this.getDistanceFromLastCorner(parentPolygon)   // C
            );

            const parentCentreToContactPoint = parentSAS.a;

            // TODO: calculate center relative to parent

        }

        this.state.centre.x = parentCentreX + (Math.cos(parentRadians + arcToParentRadians) * radiusRelative);
        this.state.centre.y = parentCentreY + (Math.sin(parentRadians + arcToParentRadians) * radiusRelative);

        // New x1 & y1 to reflect change in radians
        this.state.drawPoint.x = this.state.centre.x + (Math.cos(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
        this.state.drawPoint.y = this.state.centre.y + (Math.sin(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
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

    getRadiansToCompleteFace(parentPolygon: PolygonInterface): number {
        const facesPerParentFace = Math.ceil(parentPolygon.faceWidth / this.faceWidth);

        return this.getInnerAngle() * facesPerParentFace;
    }

    getCornersPassed(parentPolygon: PolygonInterface): number {
        const offset = this.getOffsetRadians(parentPolygon);

        return Math.floor((this.state.totalAngle - offset) / (this.getRadiansToCompleteFace(parentPolygon) + parentPolygon.getExternalAngle()));
    }

    isOnCorner(parentPolygon: PolygonInterface): boolean {
        const baseValue = this.getRadiansToCompleteFace(parentPolygon) + this.getOffsetRadians(parentPolygon);
        const minRadians = baseValue + (this.getRadiansToCompleteFace(parentPolygon) * this.getCornersPassed(parentPolygon));
        const maxRadians = minRadians + parentPolygon.getExternalAngle();

        return (this.state.totalAngle > minRadians && this.state.totalAngle < maxRadians);
    }

    getOffsetRadians(parentPolygon: PolygonInterface): number {
        let offset = 0;

        if (this.faces % 2 !== 0) {
            offset = (parentPolygon.getExternalAngle() / 2);
        }

        return offset;
    }

    getOffsetDistance(parentPolygon: PolygonInterface): number {
        let offset = 0;

        if(this.faces % 2 !== 0) {
            offset = this.faceWidth / 2;
        }

        return offset;
    }

    /** This will always be a multiple of either
     * the child face width or parent face width
     * */
    getDistanceFromOrigin(parentPolygon: PolygonInterface): number {
        let distance;

        if(this.isOnCorner(parentPolygon)) {
            distance = (this.getCornersPassed(parentPolygon) + 1) * parentPolygon.faceWidth;
        } else {
            const flattenedTotalAngle = this.state.totalAngle - ((this.getCornersPassed(parentPolygon)) * parentPolygon.getExternalAngle());
            distance = Math.floor(flattenedTotalAngle / this.getRadiansPerFace()) * this.faceWidth;
        }

        return distance;
    }

    getDistanceFromLastCorner(parentPolygon: PolygonInterface): number {
        return this.getDistanceFromOrigin(parentPolygon) % parentPolygon.faceWidth;
    }

    // Calculate values of a triangle where we know two sides and the angle between them
    public getValuesFromSAS(sideB, angleA, sideC): PolygonSas {

        let sideA; // a
        let angleB; // B
        let angleC; // C

        // a^2 = b^2 + c^2 − 2bc cosA
        sideA = Math.sqrt(Math.pow(sideB, 2) + Math.pow(sideC, 2) - (2 * sideB * sideC * Math.cos(angleA)));

        const smallAngle = Math.asin( (Math.sin(angleA)*Math.min(sideB, sideC)) / sideA );
        const largeAngle = Math.PI - smallAngle;

        if (sideB < sideC) {
            angleB = smallAngle;
            angleC = largeAngle;
        } else {
            angleC = smallAngle;
            angleB = largeAngle;
        }

        const polygonSas = new PolygonSas();
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

class PolygonSas implements PolygonSasInterface {
    a: number;
    b: number;
    c: number;
    A: number;
    B: number;
    C: number;
}

export {
    Polygon,
    PolygonState,
    PolygonCenterPosition,
    PolygonDrawPosition,
}
