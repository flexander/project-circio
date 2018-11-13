import Circle from 'circio-shapes';

export default class Engine {
    constructor (options) {
        // List of circles
        this.list = [];
        // List of callbacks
        this.callbacks= [];
        // Milliseconds between each loop
        this.interval = (typeof options.interval !== 'undefined') ? options.interval : 1;
        // Default number of steps in a circle
        this.steps = (typeof options.steps !== 'undefined') ? options.steps : 0;
        // Area dimensions
        this.height = (typeof options.height !== 'undefined') ? options.height : 700;
        this.width = (typeof options.width !== 'undefined') ? options.width : 700;
        // Engine paused state
        this.paused = (typeof options.paused !== 'undefined') ? options.paused : false;
        this.steps = 0;
    }

    addCircle (circle) {
        if(!(circle instanceof Circle)) {
            throw 'This object is not a circle';
        }
        // Center Root circles
        if(typeof circle.parent === 'undefined') {
            if(!Number.isInteger(circle.x0)) {
                circle.x0 = this.width/2;
            }
            if(!Number.isInteger(circle.y0)) {
                circle.y0 = this.height/2;
            }
        }

        // Default steps
        if(circle.steps === false) {
            circle.steps = this.steps;
        }

        this.list.push(circle);
        circle.id = this.list.indexOf(circle);

        return circle.id;
    };

    addCircles (circles) {
        circles.forEach(circle => {
            this.addCircle(circle);
        });

        return this;
    }

    resetCircles () {
        this.list.forEach(circle => {
            circle.radians = circle.settings.radians;
        });
    }

    calculateCircle (circle) {
        let arc = circle.getArc();
        let stepCount = circle.getStepCount();
        let distanceTravelled = arc * stepCount;
        let arcToParentRadians = 0;
        let parentRadians = circle.getParentRadians();
        let radiusRelative = 0;
        let parentX0 = circle.x0;
        let parentY0 = circle.y0;

        if(typeof circle.parent !== 'undefined') {
            parentX0 = circle.parent.x0;
            parentY0 = circle.parent.y0;

            arcToParentRadians = (distanceTravelled / circle.parent.radius);
            if(circle.outside === false) {
                arcToParentRadians *= -1;
            }

            // The distance from center to center of child and parent
            if(circle.outside === true) {
                radiusRelative = circle.parent.radius + circle.radius;
            } else {
                radiusRelative = circle.parent.radius - circle.radius;
            }
        }

        circle.x0 = parentX0 + (Math.cos(parentRadians + arcToParentRadians) * radiusRelative);
        circle.y0 = parentY0 + (Math.sin(parentRadians + arcToParentRadians) * radiusRelative);

        // New x1 & y1 to reflect change in radians
        circle.x1 = circle.x0 + (Math.cos(parentRadians + arcToParentRadians + circle.radians) * circle.radius);
        circle.y1 = circle.y0 + (Math.sin(parentRadians + arcToParentRadians + circle.radians) * circle.radius);
    }

    calculateCircles() {
        this.list.forEach(circle => {
            this.calculateCircle(circle);
        });
    }

    exportCircles (encode = true) {
        let data = this.list.map(shape => {
            const keys = Object.keys(shape.settings);
            return keys.map(setting => {
                return {[setting]: shape[setting]};
            });
        });

        data = JSON.stringify(data);
        if(encode === true) {
            return btoa(data);
        }

        return data;
    }

    importCircles (data) {
        let circles = JSON.parse(atob(data));
        let indexedCircles = [];

        circles.forEach(circle => {
            indexedCircles[circle.id] = circle;
        });

        circles.forEach(circle => {
            if(typeof circle.parentId !== 'undefined') {
                circle.parent = indexedCircles[circle.parentId];
            }
        });
        this.addCircles(circles);
    }

    addCallback (callback) {
        this.callbacks.push(callback);
    }

    run () {
        setTimeout(() => {
            if (this.paused === false) {
                this.runOnce();
            }
            this.run();
        },this.interval);
    };

    step (steps = 1) {
        for(let i = 0; i < steps; i++) {
            this.runOnce();
        }
    }

    runOnce () {
        this.list.forEach(circle => {
            this.calculateCircle(circle);
            circle.move();
        });

        this.callbacks.forEach(callback => {
            if (typeof callback === 'function') {
                callback.call(null, this);
            }
        });
        this.steps += 1;
    }

    pause () {
        this.paused = true;
    }

    play () {
        this.paused = false;
    }
}
