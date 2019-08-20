import math from 'mathjs';
import '../structure';

class Circle implements CircleInterface {
    brushes: BrushInterface[];
    clockwise: boolean;
    fixed: boolean;
    id: number;
    outside: boolean;
    radius: number;
    startAngle: number;
    state: ShapeStateInterface;
    stepMod: number;
    steps: number;

    calculate(parentCircle: CircleInterface|null): void {
        let arc = this.getArc();
        let stepCount = this.state.stepCount;
        let distanceTravelled = arc * stepCount;
        let arcToParentRadians = 0;
        let parentRadians = parentCircle !== null ? parentCircle.state.getAngle():0; //TODO: should this be parentCircle.state.totalAngle?
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
        this.state.previousState = this.state;
        this.state.drawPoint.x = this.state.centre.x + (Math.cos(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
        this.state.drawPoint.y = this.state.centre.y + (Math.sin(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);

        if (this.clockwise === true) {
            this.state.totalAngle += this.getStepRadians();
        } else {
            this.state.totalAngle -= this.getStepRadians();
        }
    }

    public getAngle(): number {
        return Math.atan2(
            (this.state.drawPoint.y - this.state.centre.y), // Delta Y
            (this.state.drawPoint.x - this.state.centre.x) // Delta X
        );
    }

    protected getArc () {
        if (this.steps === 0) {
            return 0;
        }

        return math.multiply(this.radius, this.getStepRadians());
    }

    protected getStepRadians () {
        let stepRadian = 0;
        if(this.steps > 0) {
            stepRadian = math.fraction(math.multiply(math.pi, 2), this.steps);
        }

        return stepRadian;
    }

    reset(): void {
        this.state = this.state.initialState;
    }

}