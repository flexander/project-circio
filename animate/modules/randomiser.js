"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circ_1 = require("./circ");
var circle_1 = require("./circle");
var brushes_1 = require("./brushes");
var seedrandom = require("seedrandom");
var Randomiser = /** @class */ (function () {
    function Randomiser(seed) {
        this.maxSteps = 40000;
        if (typeof seed !== 'undefined') {
            this.randomSeed = seed;
            this.maxSteps = 40000;
        }
    }
    Randomiser.prototype.make = function (shapeConfigGenerators) {
        var _this = this;
        if (typeof this.randomSeed !== 'undefined') {
            seedrandom(this.randomSeed, { global: true });
        }
        return new Promise(function (resolve, reject) {
            if (typeof _this.randomSeed !== 'undefined') {
                seedrandom(_this.randomSeed, { global: true });
            }
            var circ;
            var circValid;
            do {
                circ = new circ_1.Circ();
                circ.width = 1080;
                circ.height = 1080;
                circ.backgroundFill = '#1b5eec';
                circValid = true;
                shapeConfigGenerators.forEach(function (shapeConfigGenerator) {
                    if (shapeConfigGenerator instanceof CircleConfigGenerator) {
                        var config = shapeConfigGenerator.make();
                        var circle = circle_1.Circle.fromConfig(config);
                        if (circ.getShapes().length > 0) {
                            var lastShape = circ.getEndShape();
                            if (lastShape instanceof circle_1.Circle && lastShape.radius === circle.radius && circle.outside === false) {
                                circValid = false;
                            }
                        }
                        circ.addShape(circle);
                        return;
                    }
                    throw "Unable to create shape from config of type: " + shapeConfigGenerator.constructor.name;
                });
            } while (circ.stepsToComplete > _this.maxSteps && circValid === true);
            circ.getEndShape().addBrush(new brushes_1.Brush());
            resolve(circ);
        });
    };
    Randomiser.prototype.lcm = function (x, y) {
        return Math.abs((x * y) / this.gcd(x, y));
    };
    Randomiser.prototype.gcd = function (x, y) {
        x = Math.abs(x);
        y = Math.abs(y);
        while (y) {
            var t = y;
            y = x % y;
            x = t;
        }
        return x;
    };
    Randomiser.prototype.getRandomHexColour = function () {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    };
    return Randomiser;
}());
exports.Randomiser = Randomiser;
var CircleConfigGenerator = /** @class */ (function () {
    function CircleConfigGenerator() {
        this.radiusGenerator = new NumberGenerator(10, 250);
        this.stepGenerator = new NumberGenerator(500, 1500);
        this.booleanGenerator = new BooleanGenerator();
    }
    CircleConfigGenerator.prototype.make = function () {
        var circleConfig = new circle_1.CircleConfig();
        circleConfig.clockwise = this.booleanGenerator.make();
        circleConfig.outside = this.booleanGenerator.make();
        circleConfig.steps = this.stepGenerator.make();
        circleConfig.radius = this.radiusGenerator.make();
        return circleConfig;
    };
    return CircleConfigGenerator;
}());
exports.CircleConfigGenerator = CircleConfigGenerator;
var NumberGenerator = /** @class */ (function () {
    function NumberGenerator(min, max) {
        this.min = Math.ceil(min);
        this.max = Math.floor(max);
    }
    NumberGenerator.prototype.make = function () {
        return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    };
    return NumberGenerator;
}());
exports.NumberGenerator = NumberGenerator;
var BooleanGenerator = /** @class */ (function () {
    function BooleanGenerator() {
    }
    BooleanGenerator.prototype.make = function () {
        return Math.floor(Math.random() * 2) === 1;
    };
    return BooleanGenerator;
}());
exports.BooleanGenerator = BooleanGenerator;
var rootCircle = new CircleConfigGenerator();
rootCircle.radiusGenerator = new NumberGenerator(150, 250);
rootCircle.stepGenerator = new NumberGenerator(0, 0);
var threeCircleConfigGenerators = [
    rootCircle,
    new CircleConfigGenerator,
    new CircleConfigGenerator,
];
exports.threeCircleConfigGenerators = threeCircleConfigGenerators;
