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
            this.maxSteps = 400000;
        }
    }
    Randomiser.prototype.make = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var circ;
            var count = 0;
            while (typeof circ === 'undefined') {
                try {
                    circ = _this.randomSeed ? _this.generate("" + _this.randomSeed + count) : _this.generate();
                }
                catch (_a) {
                }
                count++;
            }
            if (typeof _this.randomSeed !== "undefined") {
                console.log("found a valid seed: " + _this.randomSeed + count);
            }
            resolve(circ);
        });
    };
    Randomiser.prototype.generate = function (seed) {
        if (typeof seed !== 'undefined') {
            seedrandom(seed, { global: true });
        }
        var pr = this.getRandomInt(0, 250);
        var cr = this.getRandomInt(10, 250);
        var ccr = this.getRandomInt(10, 250);
        var ps = 0;
        var cs = this.getRandomInt(500, 1500);
        var ccs = this.getRandomInt(500, 1500);
        var circ = new circ_1.Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var circle = new circle_1.Circle();
        circle.steps = ps;
        circle.radius = pr;
        var circle1 = new circle_1.Circle();
        circle1.steps = cs;
        circle1.clockwise = this.getRandomBool();
        circle1.radius = cr;
        circle1.outside = circle.radius === circle1.radius ? true : this.getRandomBool();
        var circle2 = new circle_1.Circle();
        circle2.steps = ccs;
        circle2.clockwise = this.getRandomBool();
        circle2.radius = ccr;
        circle1.outside = circle1.radius === circle2.radius ? true : this.getRandomBool();
        var brush = new brushes_1.Brush();
        circle2.addBrush(brush);
        circ.addShape(circle);
        circ.addShape(circle1);
        circ.addShape(circle2);
        var stepsToComplete = circ.stepsToComplete;
        if (stepsToComplete > this.maxSteps) {
            throw 'too many steps';
        }
        console.log(pr, cs, cr, cs, ccr, ccs, stepsToComplete);
        return circ;
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
    Randomiser.prototype.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Randomiser.prototype.getRandomBool = function () {
        return this.getRandomInt(0, 1) ? true : false;
    };
    Randomiser.prototype.getRandomHexColour = function () {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    };
    return Randomiser;
}());
exports.Randomiser = Randomiser;
