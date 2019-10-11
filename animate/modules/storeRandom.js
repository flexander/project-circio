"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = require("./circle");
var brushes_1 = require("./brushes");
var circ_1 = require("./circ");
var StoreRandom = /** @class */ (function () {
    function StoreRandom() {
        this.name = 'Randomiser';
    }
    StoreRandom.prototype.get = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var circ = _this.makeCirc();
            circ.name = 'Random Circ';
            resolve(circ);
        });
    };
    StoreRandom.prototype.getIndex = function (index) {
        return this.get(index.toString());
    };
    StoreRandom.prototype.list = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var circs = [];
            for (var i = 0; i < 5; i++) {
                var circ = _this.makeCirc();
                circ.name = "Random Circ " + (i + 1);
                circs.push(circ);
            }
            resolve(circs);
        });
    };
    StoreRandom.prototype.store = function (name, circ) {
    };
    StoreRandom.prototype.delete = function (name) {
        throw new Error("Blueprints can't be deleted.");
    };
    StoreRandom.prototype.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    StoreRandom.prototype.getRandomBool = function () {
        return this.getRandomInt(0, 1) === 1;
    };
    StoreRandom.prototype.makeCirc = function () {
        var j = 0;
        while (j++ < 500) {
            var pr = this.getRandomInt(10, 200);
            var cr = this.getRandomInt(10, 200);
            var ratio = pr / cr;
            var multiple_1 = void 0;
            for (var i = 0; i < 10; i++) {
                // console.log(pr,cr,i);
                if ((ratio * i) % 1 === 0) {
                    multiple_1 = i;
                    continue;
                }
                multiple_1 = null;
            }
            if (multiple_1 !== null) {
                console.warn(pr, cr, multiple_1);
            }
        }
        var circ = new circ_1.Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var shapes = this.getRandomInt(2, 4);
        var multiple = this.getRandomInt(2, 10);
        for (var i = 0; i < shapes; i++) {
            var circle = new circle_1.Circle();
            circle.steps = this.getRandomInt(10, 100) * multiple;
            circle.outside = this.getRandomBool();
            circle.fixed = true;
            circle.clockwise = this.getRandomBool();
            circle.stepMod = 0;
            circle.startAngle = 0;
            circle.radius = this.getRandomInt(10, 100) * multiple;
            circ.addShape(circle);
        }
        var brush = new brushes_1.Brush();
        brush.color = '#FFFFFF';
        brush.degrees = 0;
        brush.link = this.getRandomBool();
        brush.offset = 0;
        brush.point = 0.5;
        circ.getShapes()[circ.getShapes().length - 1].getBrushes().push(brush);
        return circ;
    };
    return StoreRandom;
}());
exports.StoreRandom = StoreRandom;
