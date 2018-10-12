class Engine {
    constructor (options) {
        // List of circles
        this.list = [];
        // List of callbacks
        this.callbacks= [];
        // Milliseconds between each loop
        this.interval = 1;
        // Default number of steps in a circle
        this.steps = 1000;
        // Area dimensions
        this.height = (typeof options.height !== 'undefined') ? options.height : 700;
        this.width = (typeof options.width !== 'undefined') ? options.width : 700;
        // Engine paused state
        this.paused = (typeof options.paused !== 'undefined') ? options.paused : false;
    }

	addCircle (circle) {
        circle.x0 = (typeof circle.x0 !== 'undefined') ? circle.x0 : this.width / 2;
        circle.y0 = (typeof circle.y0 !== 'undefined') ? circle.y0 : this.height / 2;
        circle.parentId = (typeof circle.parent !== 'undefined') ? circle.parent.id: false;
        circle.direction = (typeof circle.direction !== 'undefined') ? circle.direction: 'cw';
        circle.position = (typeof circle.position !== 'undefined') ? circle.position: 'inside';
        circle.radians = (typeof circle.radians !== 'undefined') ? circle.radians: 0;
        circle.pointOffset = (typeof circle.pointOffset !== 'undefined') ? circle.pointOffset: 0;
        circle.steps = (typeof circle.steps !== 'undefined') ? circle.steps: this.steps;

        circle.getStepRadian = function () {
            let stepRadian = 0;
            if(this.steps > 0) {
                stepRadian = (360/this.steps) * (Math.PI/180);
            }
            return stepRadian;
        }.bind(circle);

        circle.getArc = function () {
            let arc = 0;
            if(this.steps > 0) {
                arc = this.radius * this.getStepRadian();
            }
            return arc;
        }.bind(circle);

        circle.getStepCount = function () {
            let stepCount = 0;

            return stepCount;
        }.bind(circle);

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

	/*initCircle (circle) {
        let radiusRelative;

        if(typeof circle.parent !== 'undefined') {
            if(circle.position === 'inside') {
                radiusRelative = circle.parent.radius - (circle.radius);
            } else {
                radiusRelative = circle.parent.radius + (circle.radius);
            }
            circle.x0 = circle.parent.x0 + (Math.cos(circle.parent.radians) * radiusRelative);
            circle.y0 = circle.parent.y0 + (Math.sin(circle.parent.radians) * radiusRelative);
            // Take a snapshot of parent position
            circle.parentSnapShot = {
                x0: circle.parent.x0,
                y0: circle.parent.y0,
                radians: circle.parent.radians
            };
        } else {
            circle.x0 = (typeof circle.x0 !== 'undefined') ? circle.x0 : this.width / 2;
            circle.y0 = (typeof circle.y0 !== 'undefined') ? circle.y0 : this.height / 2;
        }

        circle.x1 = circle.x0 + (Math.cos(circle.radians) * circle.radius);
        circle.y1 = circle.y0 + (Math.sin(circle.radians) * circle.radius);

        circle.x2 = circle.x0 + (Math.cos(circle.radians) * (circle.radius + circle.pointOffset));
        circle.y2 = circle.y0 + (Math.sin(circle.radians) * (circle.radius + circle.pointOffset));

		return circle;
	};*/

    calculateCircle (circle) {
        let arc = circle.getArc();
        let stepRadian = circle.getStepRadian();
        let stepCount = circle.getStepCount();
        let arcToParentRadians = 0;
	    let radiusRelative;
        if(typeof circle.parent !== 'undefined') {
            // The distance from center to center of child and parent
            if(circle.position === 'inside') {
                radiusRelative = circle.parent.radius - circle.radius;
            } else {
                radiusRelative = circle.parent.radius + circle.radius;
            }

            // If current circle needs to roll
            if(circle.steps > 0) {
                if(circle.stepCount > 0) {
                    arcToParentRadians = (arc / circle.parent.radius) * circle.stepCount;
                }

                // Radians changed in one step
                if (circle.direction === 'cw') {
                    if(circle.position === 'inside') {
                        circle.radians += (stepRadian * circle.stepCount);
                        circle.radians -= arcToParentRadians;
                    } else {
                        circle.radians += (circle.step * circle.stepCount);
                        circle.radians += arcToParentRadians;
                    }
                } else {
                    if(circle.position === 'inside') {
                        circle.radians -= (circle.step * circle.stepCount);
                        circle.radians += arcToParentRadians;
                    } else {
                        circle.radians -= (circle.step * circle.stepCount);
                        circle.radians -= arcToParentRadians;
                    }
                }
            }

            circle.x0 = circle.parent.x0 + (Math.cos(circle.parent.radians + arcToParentRadians) * radiusRelative);
            circle.y0 = circle.parent.y0 + (Math.sin(circle.parent.radians + arcToParentRadians) * radiusRelative);
        }
        // New x1 & y1 to reflect change in radians
        circle.x1 = circle.x0 + (Math.cos(circle.radians) * circle.radius);
        circle.y1 = circle.y0 + (Math.sin(circle.radians) * circle.radius);

        // New x2 & y2 to reflect change in radians
        circle.x2 = circle.x0 + (Math.cos(circle.radians) * (circle.radius + circle.pointOffset));
        circle.y2 = circle.y0 + (Math.sin(circle.radians) * (circle.radius + circle.pointOffset));
    }

    calculateCircles() {
        this.list.forEach(circle => {
            this.calculateCircle(circle);
        });
    }

    moveCircle(circle) {
        let stepRadian = circle.getStepRadian();

        if(circle.direction === 'cw') {
            circle.radians += stepRadian;
        } else {
            circle.radians -= stepRadian;
        }
    }

    exportCircles () {
        return btoa(JSON.stringify(this.list));
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
		setInterval(() => {
			if(this.paused === false) {
				this.list.forEach(circle => {
					this.calculateCircle(circle);
					this.moveCircle(circle);
				});

				this.callbacks.forEach(callback => {
                    if(typeof callback === 'function') {
                        callback.call(null, this);
                    }
                });
			}
		},this.interval);
	};

	pause () {
		this.paused = true;
	}

	play () {
		this.paused = false;
	}
}