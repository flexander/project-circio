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
var structure_1 = require("../structure");
var events_1 = require("./events");
var Circ = /** @class */ (function (_super) {
    __extends(Circ, _super);
    function Circ() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.config = new CircConfig();
        _this.shapes = [];
        return _this;
    }
    Circ.prototype.addShape = function (shape) {
        shape.isRoot = (this.shapes.length === 0);
        this.shapes.push(shape);
        this.dispatchEvent(new events_1.ShapeAddEvent(shape));
    };
    Circ.prototype.removeShape = function (id) {
        var _this = this;
        var shapesRemoved = [];
        this.shapes = this.shapes.filter(function (shape) {
            var remove = shape.id !== id;
            if (remove === true) {
                shapesRemoved.push(shape);
            }
            return remove;
        });
        shapesRemoved.forEach(function (shape) {
            _this.dispatchEvent(new events_1.ShapeDeleteEvent(shape));
        });
    };
    Circ.prototype.getShapes = function () {
        return this.shapes;
    };
    Object.defineProperty(Circ.prototype, "name", {
        get: function () {
            return this.config['name'];
        },
        set: function (name) {
            this.config['name'] = name;
            this.dispatchEvent(new events_1.AttributeChangedEvent('name', this.name));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "height", {
        get: function () {
            return this.config.height;
        },
        set: function (height) {
            this.config.height = height;
            this.dispatchEvent(new events_1.AttributeChangedEvent('height', this.height));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "width", {
        get: function () {
            return this.config.width;
        },
        set: function (width) {
            this.config.width = width;
            this.dispatchEvent(new events_1.AttributeChangedEvent('width', this.width));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "backgroundFill", {
        get: function () {
            return this.config.backgroundFill;
        },
        set: function (backgroundFill) {
            this.config.backgroundFill = backgroundFill;
            this.dispatchEvent(new events_1.AttributeChangedEvent('backgroundFill', this.backgroundFill));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "modified", {
        get: function () {
            return this.config.modified;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "stepsToComplete", {
        get: function () {
            if (this.getShapes().length !== 3) {
                throw 'currently only works for 3 shape circs';
            }
            if (this.getShapes()[0].steps !== 0) {
                throw 'currently only works for motionless root shape';
            }
            var pr = this.getShapes()[0].radius;
            var cr = this.getShapes()[1].radius;
            var ccr = this.getShapes()[2].radius;
            var ps = this.getShapes()[0].steps;
            var cs = this.getShapes()[1].steps;
            var ccs = this.getShapes()[2].steps;
            var prCrRatio = pr / cr;
            var CrCcrRatio = cr / ccr;
            var multiple = null;
            for (var i = 1; i < 20; i++) {
                if ((prCrRatio * i) % 1 === 0 && (CrCcrRatio * i) % 1 === 0) {
                    multiple = i;
                    break;
                }
            }
            if (multiple == null) {
                return Infinity;
            }
            var childStepsToComplete = cs * prCrRatio * multiple;
            var childchildStepsToComplete = ccs * CrCcrRatio * multiple;
            return this.lcm(childStepsToComplete, childchildStepsToComplete);
        },
        enumerable: true,
        configurable: true
    });
    Circ.prototype.lcm = function (x, y) {
        return Math.abs((x * y) / this.gcd(x, y));
    };
    Circ.prototype.gcd = function (x, y) {
        x = Math.abs(x);
        y = Math.abs(y);
        while (y) {
            var t = y;
            y = x % y;
            x = t;
        }
        return x;
    };
    return Circ;
}(structure_1.EventEmitter));
exports.Circ = Circ;
var CircConfig = /** @class */ (function () {
    function CircConfig() {
    }
    return CircConfig;
}());
exports.CircConfig = CircConfig;
