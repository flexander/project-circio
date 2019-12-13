import '../structure';
import {
    BrushInterface,
    CircleConfigInterface,
    CircleInterface,
    EventEmitter,
    PositionInterface,
    ShapeStateInterface
} from "../structure";
import {AttributeChangedEvent} from "./events";
const cloneDeep = require('lodash.clonedeep');

class Circle extends EventEmitter implements CircleInterface {
    id: number;
    protected brushes: BrushInterface[] = [];
    state: ShapeStateInterface = new CircleState();
    protected config: CircleConfig = new CircleConfig();
    faces: number;
    faceWidth: number;

    constructor() {
        super();

        this.id = Math.floor(Math.random()*100000);

        this.saveInitialState();
    }

    static fromConfig(config: CircleConfig): Circle {
        const circle = new Circle();
        circle.config = config;

        return circle;
    }

    calculatePosition(parentCircle: CircleInterface|null): void {
        this.savePreviousState();

        let arc = this.getArc();
        let stepCount = this.getStepCount();
        let distanceTravelled = arc * stepCount;
        let arcToParentRadians = 0;
        let parentRadians = parentCircle !== null && this.fixed === true ? parentCircle.state.getAngle():0;
        let radiusRelative = 0;
        let parentCentreX = this.state.centre.x;
        let parentCentreY = this.state.centre.y;

        if (parentCircle !== null) {
            parentCentreX = parentCircle.state.centre.x;
            parentCentreY = parentCircle.state.centre.y;

            arcToParentRadians = (distanceTravelled / parentCircle.radius);
            if(this.outside === false) {
                arcToParentRadians *= -1;
            }

            // The distance from center to center of child and parent
            if(this.outside === true) {
                radiusRelative = parentCircle.radius + this.radius;
            } else {
                radiusRelative = parentCircle.radius - this.radius;
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

    protected savePreviousState() {
        const previousState = cloneDeep(this.state);
        delete previousState.initialState;
        delete previousState.previousState;

        this.state.previousState = previousState;
    }

    protected saveInitialState() {
        const initialState = cloneDeep(this.state);
        delete initialState.initialState;
        delete initialState.previousState;

        this.state.initialState = initialState;
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

    reset(): void {
        this.state = cloneDeep(this.state.initialState);

        // Create a new initial state object
        this.saveInitialState();
    }

    public addBrush(brush: BrushInterface): void {
        this.brushes.push(brush);
    }

    public getBrushes(): BrushInterface[] {
        return this.brushes;
    }

    get steps(): number {
        return this.config.steps;
    }

    set steps(steps: number) {
        this.config.steps = steps;
        this.dispatchEvent(new AttributeChangedEvent('steps', this.steps));
    }

    get outside(): boolean {
        return this.config.outside;
    }

    set outside(outside: boolean) {
        this.config.outside = outside;
        this.dispatchEvent(new AttributeChangedEvent('outside', this.outside));
    }

    get fixed(): boolean {
        return this.config.fixed;
    }

    set fixed(fixed: boolean) {
        this.config.fixed = fixed;
        this.dispatchEvent(new AttributeChangedEvent('fixed', this.fixed));
    }

    get clockwise(): boolean {
        return this.config.clockwise;
    }

    set clockwise(clockwise: boolean) {
        this.config.clockwise = clockwise;
        this.dispatchEvent(new AttributeChangedEvent('clockwise', this.clockwise));
    }

    get isRoot(): boolean {
        return this.config.isRoot;
    }

    set isRoot(isRoot: boolean) {
        this.config.isRoot = isRoot;
        this.dispatchEvent(new AttributeChangedEvent('isRoot', this.isRoot));
    }

    get stepMod(): number {
        return this.config.stepMod;
    }

    set stepMod(stepMod: number) {
        this.config.stepMod = stepMod;
        this.dispatchEvent(new AttributeChangedEvent('stepMod', this.stepMod));
    }

    get startAngle(): number {
        return this.config.startAngle;
    }

    set startAngle(startAngle: number) {
        this.config.startAngle = startAngle;
        this.dispatchEvent(new AttributeChangedEvent('startAngle', this.startAngle));
    }

    get radius(): number {
        return this.config.radius;
    }

    set radius(radius: number) {

        if (isNaN(radius) || radius <= 0) {
            throw new Error(`Radius must be a positive, non-zero integer`);
        }

        this.config.radius = radius;
        this.dispatchEvent(new AttributeChangedEvent('radius', this.radius));
    }

    get modified(): boolean {
        return this.config.modified;
    }
}

class CircleConfigDefault implements CircleConfigInterface {
    steps: number = 500;
    outside: boolean = true;
    fixed: boolean = true;
    clockwise: boolean = true;
    stepMod: number = 0;
    startAngle: number = 0;
    isRoot: boolean = false;
    modified: boolean;
    radius: number = 100;
    faceWidth: number;
    faces: number;

    constructor() {
        if (new.target === CircleConfigDefault) {
            Object.freeze(this);
        }
    }
}

class CircleConfig extends CircleConfigDefault implements CircleConfigInterface {
}

class CircleState implements ShapeStateInterface {
    centre: PositionInterface = new CircleCenterPosition();
    drawPoint: PositionInterface = new CircleDrawPosition();
    contactPoint: PositionInterface = new CircleDrawPosition();
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

class CircleCenterPosition implements PositionInterface {
    x: number = 0;
    y: number = 0;
}

class CircleDrawPosition implements PositionInterface {
    x: number;
    y: number;
}

export {
    Circle,
    CircleState,
    CircleCenterPosition,
    CircleConfig,
    CircleConfigDefault,
    CircleDrawPosition,
}
