class Shape {
    constructor(options) {}

    setParent (parent) {
        if(!(parent instanceof this)) {
            throw 'This parent is not a shape';
        }

        this.parent = parent;
    }
}

export class Circle extends Shape {
    constructor (options) {
        super(options);

        if(!Number.isInteger(options.radius)) {
            throw 'A circle needs a radius';
        }

        this.settings = {
            radius : options.radius,
            x0 : (typeof options.x0 !== 'undefined') ? options.x0 : false,
            y0 : (typeof options.y0 !== 'undefined') ? options.y0 : false,
            parentId : (typeof options.parent !== 'undefined') ? options.parent.id: false,
            direction : (typeof options.direction !== 'undefined') ? options.direction: 'cw',
            position : (typeof options.position !== 'undefined') ? options.position: 'inside',
            steps : (typeof options.steps !== 'undefined') ? options.steps: 0,
            radians : (typeof options.radians !== 'undefined') ? options.radians: 0,
            pointOffset : (typeof options.pointOffset !== 'undefined') ? options.pointOffset: 0,
        };

        Object.assign(this, JSON.parse(JSON.stringify(this.settings)));
    }

    getStepRadians () {
        let stepRadian = 0;
        if(this.steps > 0) {
            stepRadian = (360/this.steps) * (Math.PI/180);
        }
        return stepRadian;
    }

    getArc () {
        let arc = 0;
        if(this.steps > 0) {
            arc = this.radius * this.getStepRadians();
        }
        return arc;
    }

    getStepCount () {
        let stepCount = 0;
        if(this.steps > 0) {
            stepCount = this.radians / this.getStepRadians();
        }
        return stepCount;
    }

    getParentRadians () {
        if(typeof this.parent === 'undefined') {
            return 0;
        }

        return Math.atan2(
            (this.parent.y1 - this.parent.y0), // Delta Y
            (this.parent.x1 - this.parent.x0) // Delta X
        );
    }
}
