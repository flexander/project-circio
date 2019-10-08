"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("../structure");
var structure_1 = require("../structure");
var events_1 = require("./events");
var cloneDeep = require('lodash.clonedeep');
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        var _this = _super.call(this) || this;
        _this.brushes = [];
        _this.state = new CircleState();
        _this.config = new CircleConfig();
        _this.id = Math.floor(Math.random() * 100000);
        _this.saveInitialState();
        return _this;
    }
    Circle.prototype.calculatePosition = function (parentCircle) {
        this.savePreviousState();
        var arc = this.getArc();
        var stepCount = this.getStepCount();
        var distanceTravelled = arc * stepCount;
        var arcToParentRadians = 0;
        var parentRadians = parentCircle !== null && this.fixed === true ? parentCircle.state.getAngle() : 0;
        var radiusRelative = 0;
        var parentCentreX = this.state.centre.x;
        var parentCentreY = this.state.centre.y;
        if (parentCircle !== null) {
            parentCentreX = parentCircle.state.centre.x;
            parentCentreY = parentCircle.state.centre.y;
            arcToParentRadians = (distanceTravelled / parentCircle.radius);
            if (this.outside === false) {
                arcToParentRadians *= -1;
            }
            // The distance from center to center of child and parent
            if (this.outside === true) {
                radiusRelative = parentCircle.radius + this.radius;
            }
            else {
                radiusRelative = parentCircle.radius - this.radius;
            }
        }
        this.state.centre.x = parentCentreX + (Math.cos(parentRadians + arcToParentRadians) * radiusRelative);
        this.state.centre.y = parentCentreY + (Math.sin(parentRadians + arcToParentRadians) * radiusRelative);
        // New x1 & y1 to reflect change in radians
        this.state.drawPoint.x = this.state.centre.x + (Math.cos(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
        this.state.drawPoint.y = this.state.centre.y + (Math.sin(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
    };
    Circle.prototype.calculateAngle = function () {
        this.state.previousState.totalAngle = this.state.totalAngle;
        if (this.clockwise === true) {
            this.state.totalAngle += this.getStepRadians();
        }
        else {
            this.state.totalAngle -= this.getStepRadians();
        }
    };
    Circle.prototype.savePreviousState = function () {
        this.state.previousState = cloneDeep(this.state);
        delete this.state.previousState.previousState;
    };
    Circle.prototype.saveInitialState = function () {
        this.state.initialState = cloneDeep(this.state);
    };
    Circle.prototype.getArc = function () {
        if (this.steps === 0) {
            return 0;
        }
        return this.radius * this.getStepRadians();
    };
    Circle.prototype.getStepRadians = function () {
        var stepRadian = 0;
        if (this.steps > 0) {
            stepRadian = (Math.PI * 2) / this.steps;
        }
        return stepRadian;
    };
    Circle.prototype.getStepCount = function () {
        var stepCount = 0;
        if (this.steps > 0) {
            stepCount = this.state.totalAngle / this.getStepRadians();
        }
        return stepCount;
    };
    Circle.prototype.reset = function () {
        this.state = cloneDeep(this.state.initialState);
        // Create a new initial state object
        this.saveInitialState();
    };
    Circle.prototype.addBrush = function (brush) {
        this.brushes.push(brush);
    };
    Circle.prototype.getBrushes = function () {
        return this.brushes;
    };
    Object.defineProperty(Circle.prototype, "steps", {
        get: function () {
            return this.config.steps;
        },
        set: function (steps) {
            this.config.steps = steps;
            this.dispatchEvent(new events_1.AttributeChangedEvent('steps', this.steps));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "outside", {
        get: function () {
            return this.config.outside;
        },
        set: function (outside) {
            this.config.outside = outside;
            this.dispatchEvent(new events_1.AttributeChangedEvent('outside', this.outside));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "fixed", {
        get: function () {
            return this.config.fixed;
        },
        set: function (fixed) {
            this.config.fixed = fixed;
            this.dispatchEvent(new events_1.AttributeChangedEvent('fixed', this.fixed));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "clockwise", {
        get: function () {
            return this.config.clockwise;
        },
        set: function (clockwise) {
            this.config.clockwise = clockwise;
            this.dispatchEvent(new events_1.AttributeChangedEvent('clockwise', this.clockwise));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "isRoot", {
        get: function () {
            return this.config.isRoot;
        },
        set: function (isRoot) {
            this.config.isRoot = isRoot;
            this.dispatchEvent(new events_1.AttributeChangedEvent('isRoot', this.isRoot));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "stepMod", {
        get: function () {
            return this.config.stepMod;
        },
        set: function (stepMod) {
            this.config.stepMod = stepMod;
            this.dispatchEvent(new events_1.AttributeChangedEvent('stepMod', this.stepMod));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "startAngle", {
        get: function () {
            return this.config.startAngle;
        },
        set: function (startAngle) {
            this.config.startAngle = startAngle;
            this.dispatchEvent(new events_1.AttributeChangedEvent('startAngle', this.startAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "radius", {
        get: function () {
            return this.config.radius;
        },
        set: function (radius) {
            this.config.radius = radius;
            this.dispatchEvent(new events_1.AttributeChangedEvent('radius', this.radius));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "modified", {
        get: function () {
            return this.config.modified;
        },
        enumerable: true,
        configurable: true
    });
    return Circle;
}(structure_1.EventEmitter));
exports.Circle = Circle;
var CircleConfig = /** @class */ (function () {
    function CircleConfig() {
    }
    return CircleConfig;
}());
exports.CircleConfig = CircleConfig;
var CircleState = /** @class */ (function () {
    function CircleState() {
        this.centre = new CircleCenterPosition();
        this.drawPoint = new CircleDrawPosition();
        this.initialState = Object.create(this);
        this.previousState = null;
        this.totalAngle = 0;
    }
    CircleState.prototype.getAngle = function () {
        return Math.atan2((this.drawPoint.y - this.centre.y), // Delta Y
        (this.drawPoint.x - this.centre.x) // Delta X
        );
    };
    return CircleState;
}());
exports.CircleState = CircleState;
var CircleCenterPosition = /** @class */ (function () {
    function CircleCenterPosition() {
        this.x = 0;
        this.y = 0;
    }
    return CircleCenterPosition;
}());
exports.CircleCenterPosition = CircleCenterPosition;
var CircleDrawPosition = /** @class */ (function () {
    function CircleDrawPosition() {
    }
    return CircleDrawPosition;
}());
exports.CircleDrawPosition = CircleDrawPosition;
