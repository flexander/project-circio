import math from 'mathjs';

class Shape {
    constructor(options) {}

    setParent (parent) {
        if(!(parent instanceof Shape)) {
            throw 'This parent is not a shape';
        }

        this.parent = parent;
    }
}

export default class Circle extends Shape {
    constructor (options) {
        super(options);

        if(isNaN(options.radius)) {
            throw 'A circle needs a radius';
        }

        if(typeof options.parent !== 'undefined') {
            this.setParent(options.parent);
        }

        this.radians = 0;

        this.settings = {
            radius : options.radius,
            clockwise : (typeof options.clockwise !== 'undefined') ? options.clockwise: true,
            outside : (typeof options.outside !== 'undefined') ? options.outside: false,
            steps : (typeof options.steps !== 'undefined') ? options.steps: false,
            fixed : (typeof options.fixed !== 'undefined') ? options.fixed: true,
        };
        Object.assign(this, JSON.parse(JSON.stringify(this.settings)));
    }

    getStepRadians () {
        let stepRadian = 0;
        if(this.steps > 0) {
            stepRadian = math.fraction(math.multiply(math.pi, 2), this.steps);
        }

        return stepRadian;
    }

    getArc () {
        let arc = 0;
        if(this.steps > 0) {
            arc = math.multiply(
                this.radius,
                this.getStepRadians()
            );
        }

        return arc;
    }

    getStepCount () {
        let stepCount = 0;
        if(this.steps > 0) {
            stepCount = this.radians/ this.getStepRadians();
        }

        return stepCount;
    }

    getRadians () {
        return Math.atan2(
            (this.y1 - this.y0), // Delta Y
            (this.x1 - this.x0) // Delta X
        );
    }

    getParentRadians () {
        if(typeof this.parent === 'undefined' || this.fixed === false) {
            return 0;
        }

        return this.parent.getRadians();
    }

    move () {
        let stepRadian = this.getStepRadians();

        if(this.clockwise === true) {
            this.radians += stepRadian;
        } else {
            this.radians -= stepRadian;
        }
    }
}
