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
        circle.parentId = (typeof circle.parent !== 'undefined') ? circle.parent.id: false;
        circle.direction = (typeof circle.direction !== 'undefined') ? circle.direction: 'cw';
        circle.position = (typeof circle.position !== 'undefined') ? circle.position: 'inside';
        circle.radians = (typeof circle.radians !== 'undefined') ? circle.radians: Math.PI/2;
        circle.steps = (typeof circle.steps !== 'undefined') ? circle.steps: this.steps;
        circle.step = (circle.steps > 0) ? (360/circle.steps) * (Math.PI/180) : 0;

		this.list.push(circle);

        circle.id = this.list.indexOf(circle);
		return circle.id;
	};

	addCircles (circles) {
		circles.forEach(function(circle) {
			this.addCircle(circle);
		}.bind(this));
	}

	initCircle (circle) {
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

		return circle;
	};

    calculateCircle (circle) {
        let arc;
	    let radiansNew;
        let radiansOld;
        let radiansChange;
        let radiansParent;
        let radiansCurrent;
	    let radiusRelative;

        if(typeof circle.parent !== 'undefined') {
            // If parent change in radians
            if(circle.parentSnapShot.radians !== circle.parent.radians) {
                radiansOld = Math.atan2(
                    (circle.y0 - circle.parentSnapShot.y0), // Delta Y
                    (circle.x0 - circle.parentSnapShot.x0) // Delta X
                );

                // Absolute difference in rads
                radiansChange = circle.parentSnapShot.radians - circle.parent.radians;
                radiansNew = radiansOld - radiansChange;
                circle.radians -= radiansChange;

                if(circle.position === 'inside') {
                    radiusRelative = circle.parent.radius - circle.radius;
                } else {
                    radiusRelative = circle.parent.radius + circle.radius;
                }

                // Move circle with parent rotation
                circle.x0 = circle.parent.x0 + (Math.cos(radiansNew) * radiusRelative);
                circle.y0 = circle.parent.y0 + (Math.sin(radiansNew) * radiusRelative);
            }
            // If current circle needs to roll
            if(circle.step > 0) {
                // Roll from current position
                arc = circle.radius * circle.step;
                radiansParent = arc / circle.parent.radius;

                // calc current radians relative to the parent circle
                radiansCurrent = Math.atan2(
                    (circle.y0 - circle.parent.y0), // Delta Y
                    (circle.x0 - circle.parent.x0) // Delta X
                );

                // Radians changed in one step
                if (circle.direction === 'cw') {
                    if(circle.position === 'inside') {
                        circle.radians += circle.step;
                        circle.radians -= radiansParent;
                        radiansNew = radiansCurrent - radiansParent;
                    } else {
                        circle.radians += circle.step;
                        circle.radians += radiansParent;
                        radiansNew = radiansCurrent + radiansParent;
                    }
                } else {
                    if(circle.position === 'inside') {
                        circle.radians -= circle.step;
                        circle.radians += radiansParent;
                        radiansNew = radiansCurrent + radiansParent;
                    } else {
                        circle.radians -= circle.step;
                        circle.radians -= radiansParent;
                        radiansNew = radiansCurrent - radiansParent;
                    }
                }
                // The distance from center to center of child and parent
                if(circle.position === 'inside') {
                    radiusRelative = circle.parent.radius - circle.radius;
                } else {
                    radiusRelative = circle.parent.radius + circle.radius;
                }
                circle.x0 = circle.parent.x0 + (Math.cos(radiansNew) * radiusRelative);
                circle.y0 = circle.parent.y0 + (Math.sin(radiansNew) * radiusRelative);
            }
            // Take new snap shot of parent
            circle.parentSnapShot = {
                x0: circle.parent.x0,
                y0: circle.parent.y0,
                radians: circle.parent.radians
            };
        } else {
            // Radians changed in one step
            if(circle.direction === 'cw') {
                circle.radians += circle.step;
            } else {
                circle.radians -= circle.step;
            }
        }
        // New x1 & y1 to reflect change in radians
        circle.x1 = circle.x0 + (Math.cos(circle.radians) * circle.radius);
        circle.y1 = circle.y0 + (Math.sin(circle.radians) * circle.radius);
    }

    exportCircles () {
        return btoa(JSON.stringify(this.list));
    }

    importCircles (data) {
        let circles = JSON.parse(atob(data));
        let indexedCircles = [];

        circles.forEach(function(circle) {
            indexedCircles[circle.id] = circle;
        });

        circles.forEach(function(circle) {
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
        this.list.forEach(function(circle) {
            this.initCircle(circle);
        }.bind(this));

		setInterval(function() {
			if(this.paused === false) {
				this.list.forEach(function(circle) {
					this.calculateCircle(circle);
				}.bind(this));

				this.callbacks.forEach(function(callback) {
                    if(typeof callback === 'function') {
                        callback.call(null, this);
                    }
                }.bind(this));
			}
		}.bind(this),this.interval);
	};

	pause () {
		this.paused = true;
	}

	play () {
		this.paused = false;
	}
}