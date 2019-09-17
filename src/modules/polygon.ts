import {BrushInterface, CircleInterface, PositionInterface, ShapeInterface, ShapeStateInterface} from "../structure";
const cloneDeep = require('lodash.clonedeep');

class Polygon implements ShapeInterface {
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

    constructor() {
        this.saveInitialState();
    }

    calculatePosition(parentShape: ShapeInterface|null): void {
        this.savePreviousState();

        let arc = this.getArc();
        let stepCount = this.getStepCount();
        let distanceTravelled = arc * stepCount;
        let arcToParentRadians = 0;
        let parentRadians = parentShape !== null && this.fixed === true ? parentShape.state.getAngle():0;
        let radiusRelative = 0;
        let parentCentreX = this.state.centre.x;
        let parentCentreY = this.state.centre.y;

        if (parentShape !== null) {
            parentCentreX = parentShape.state.centre.x;
            parentCentreY = parentShape.state.centre.y;

            arcToParentRadians = (distanceTravelled / parentShape.radius);
            if(this.outside === false) {
                arcToParentRadians *= -1;
            }

            const angle = this.state.totalAngle % (Math.PI * 2);
            const adjustment = (242.7-300)*Math.sin(angle % 72);

            console.log(adjustment);

            // The distance from center to center of child and parent
            if(this.outside === true) {
                radiusRelative = parentShape.radius + this.radius - adjustment;
            } else {
                radiusRelative = parentShape.radius - this.radius;
            }
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

    protected getArc () {
        if (this.steps === 0) {
            return 0;
        }

        return this.radius*this.getStepRadians();
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

    protected savePreviousState() {
        this.state.previousState = cloneDeep(this.state);
        delete this.state.previousState.previousState;
    }

    protected saveInitialState() {
        this.state.initialState = cloneDeep(this.state);
    }

    public reset(): void {
        this.state = cloneDeep(this.state.initialState);

        // Create a new initial state object
        this.saveInitialState();
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

export {
    Polygon,
    PolygonState,
    PolygonCenterPosition,
    PolygonDrawPosition,
}
