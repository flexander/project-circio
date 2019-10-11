"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circ_1 = require("./circ");
var circle_1 = require("./circle");
var brushes_1 = require("./brushes");
var Randomiser = /** @class */ (function () {
    function Randomiser() {
        this.maxSteps = 40000;
    }
    Randomiser.prototype.make = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var circ;
            while (typeof circ === 'undefined') {
                try {
                    circ = _this.generate();
                }
                catch (_a) {
                }
            }
            resolve(circ);
        });
    };
    Randomiser.prototype.generate = function () {
        var pr = 150;
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
        circle.outside = true;
        circle.fixed = true;
        circle.clockwise = true;
        circle.stepMod = 0;
        circle.startAngle = 0;
        circle.radius = pr;
        var circle1 = new circle_1.Circle();
        circle1.steps = cs;
        circle1.outside = this.getRandomBool();
        circle1.fixed = true;
        circle1.clockwise = this.getRandomBool();
        circle1.stepMod = 0;
        circle1.startAngle = 0;
        circle1.radius = cr;
        var circle2 = new circle_1.Circle();
        circle2.steps = ccs;
        circle2.outside = this.getRandomBool();
        circle2.fixed = true;
        circle2.clockwise = this.getRandomBool();
        circle2.stepMod = 0;
        circle2.startAngle = 0;
        circle2.radius = ccr;
        var brush = new brushes_1.Brush();
        brush.color = '#FFFFFF';
        brush.degrees = 0;
        brush.link = true;
        brush.offset = 0;
        brush.point = 0.5;
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
    return Randomiser;
}());
exports.Randomiser = Randomiser;
