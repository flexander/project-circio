import Circle from './shapes';

export default class Engine {
    constructor (options) {
        // List of circles
        this.list = [];
        // List of callbacks
        this.callbacks= [];

        this.settings = {
            // Milliseconds between each loop
            interval: (typeof options.interval !== 'undefined') ? options.interval : 1,
            // Default number of steps in a circle
            steps: (typeof options.steps !== 'undefined') ? options.steps : 0,
            // Area dimensions
            height: (typeof options.height !== 'undefined') ? options.height : 700,
            width: (typeof options.width !== 'undefined') ? options.width : 700,
            // Engine paused state
            paused: (typeof options.paused !== 'undefined') ? options.paused : false
        };
        Object.assign(this, JSON.parse(JSON.stringify(this.settings)));
    }

    addCircle (circle) {
        if(!(circle instanceof Circle)) {
            throw 'This is not a circle';
        }

        // Center root circle
        if(this.list.length === 0) {
            if(!Number.isInteger(circle.x0)) {
                circle.x0 = this.width/2;
            }
            if(!Number.isInteger(circle.y0)) {
                circle.y0 = this.height/2;
            }
        // Assign parent circle
        } else {
            circle.setParent(this.list[this.list.length - 1]);
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
            circle.radians = 0;
            this.calculateCircle(circle);
            circle.previousX1 = circle.x1;
            circle.previousY1 = circle.y1;
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
        circle.previousX1 = circle.x1;
        circle.previousY1 = circle.y1;
        circle.x1 = circle.x0 + (Math.cos(parentRadians + arcToParentRadians + circle.radians) * circle.radius);
        circle.y1 = circle.y0 + (Math.sin(parentRadians + arcToParentRadians + circle.radians) * circle.radius);
    }

    calculateCircles () {
        this.list.forEach(circle => {
            this.calculateCircle(circle);
        });
    }

    exportList (encode = false) {
        let listData = this.list.map(shape => {
            const keys = Object.keys(shape.settings);
            return {id: shape.id, ...keys.reduce(function(data, setting) {
                data[setting] = shape[setting];

                return data;
            }, {})};
        });

        if(encode === true) {
            return btoa(JSON.stringify(listData));
        }

        return listData;
    }

    exportEngine (encode = false) {
        const keys = Object.keys(this.settings);
        let data = keys.reduce(function(data, setting) {
            data[setting] = this[setting];

            return data;
        }.bind(this), {});

        if(encode === true) {
            return btoa(JSON.stringify(data));
        }

        return data;
    }

    export (encode = false) {
        let data = {};
        const engineData = this.exportEngine();
        const listData = this.exportList();

        data.engine = engineData;
        data.list = listData;

        if(encode === true) {
            return btoa(JSON.stringify(data));
        }

        return data;
    }

    import (data) {
        this.importEngine(data.engine);
        this.importList(data.list);
    }

    importList (shapes) {
        let indexedShapes = [];

        shapes.forEach(shape => {
            indexedShapes[shape.id] = new Circle({...shape});
        });

        shapes.forEach(shape => {
            if(typeof shape.parentId !== 'undefined') {
                indexedShapes.parent = indexedShapes[shape.parentId];
            }
        });
        this.list = [];
        this.addCircles(indexedShapes);
    }

    importEngine (data) {
        // TODO: finish engine import
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
