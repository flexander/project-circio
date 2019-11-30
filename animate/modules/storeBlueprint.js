"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circ_1 = require("./circ");
var circle_1 = require("./circle");
var brushes_1 = require("./brushes");
var polygon_1 = require("./polygon");
var BlueprintStore = /** @class */ (function () {
    function BlueprintStore() {
        this.blueprintsStore = {
            'twoCircles': this.makeTwoCircles,
            'threeCircles': this.makeThreeCircles,
            'fourCircles': this.makeFourCircles,
            'twoSquares': this.makeTwoSquares,
            'twoPolygons': this.makeTwoPolygons,
        };
        this.name = 'Blueprints';
    }
    BlueprintStore.prototype.get = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.resolveCirc(name));
        });
    };
    BlueprintStore.prototype.getIndex = function (index) {
        return new Promise(function (resolve, reject) {
            resolve(undefined);
        });
    };
    BlueprintStore.prototype.list = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var circs = [];
            for (var circName in _this.blueprintsStore) {
                circs.push(_this.resolveCirc(circName));
            }
            resolve(circs);
        });
    };
    BlueprintStore.prototype.resolveCirc = function (circName) {
        var circ = this.blueprintsStore[circName]();
        circ.name = circName;
        return circ;
    };
    BlueprintStore.prototype.store = function (name, circ) {
    };
    BlueprintStore.prototype.delete = function (name) {
        throw new Error("Blueprints can't be deleted.");
    };
    BlueprintStore.prototype.makeTwoCircles = function () {
        var circ = new circ_1.Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var circle0 = new circle_1.Circle();
        circle0.steps = 500;
        circle0.clockwise = false;
        circle0.radius = 300;
        var circle1 = new circle_1.Circle();
        circle1.steps = 500;
        circle1.radius = 100;
        var circle1Brush = new brushes_1.Brush();
        circle1.addBrush(circle1Brush);
        circ.addShape(circle0);
        circ.addShape(circle1);
        return circ;
    };
    BlueprintStore.prototype.makeThreeCircles = function () {
        var circ = new circ_1.Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var circle0 = new circle_1.Circle();
        circle0.steps = 500;
        circle0.clockwise = false;
        circle0.radius = 100;
        var circle1 = new circle_1.Circle();
        circle1.steps = 500;
        circle1.radius = 50;
        var circle2 = new circle_1.Circle();
        circle2.steps = 500;
        circle2.clockwise = false;
        circle2.radius = 25;
        var circle2Brush = new brushes_1.Brush();
        circle2.addBrush(circle2Brush);
        circ.addShape(circle0);
        circ.addShape(circle1);
        circ.addShape(circle2);
        return circ;
    };
    BlueprintStore.prototype.makeFourCircles = function () {
        var circ = new circ_1.Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var circle0 = new circle_1.Circle();
        circle0.steps = 1000;
        circle0.outside = false;
        circle0.clockwise = false;
        circle0.radius = 120;
        var circle1 = new circle_1.Circle();
        circle1.steps = 500;
        circle1.radius = 60;
        var circle2 = new circle_1.Circle();
        circle2.steps = 250;
        circle2.clockwise = false;
        circle2.radius = 30;
        var circle3 = new circle_1.Circle();
        circle3.steps = 125;
        circle3.radius = 15;
        var circle3Brush = new brushes_1.Brush();
        circle3.addBrush(circle3Brush);
        circ.addShape(circle0);
        circ.addShape(circle1);
        circ.addShape(circle2);
        circ.addShape(circle3);
        return circ;
    };
    BlueprintStore.prototype.makeTwoSquares = function () {
        var circ = new circ_1.Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var square0 = new polygon_1.Polygon();
        square0.steps = 1000;
        square0.outside = true;
        square0.fixed = true;
        square0.clockwise = false;
        square0.stepMod = 0;
        square0.startAngle = 0;
        square0.faces = 4;
        square0.faceWidth = 200;
        var square1 = new polygon_1.Polygon();
        square1.steps = 1000;
        square1.outside = true;
        square1.fixed = true;
        square1.clockwise = false;
        square1.stepMod = 0;
        square1.startAngle = 0;
        square1.faces = 4;
        square1.faceWidth = 75;
        var circle1Brush = new brushes_1.Brush();
        circle1Brush.color = '#FFFFFF';
        circle1Brush.degrees = 0;
        circle1Brush.link = false;
        circle1Brush.offset = 0;
        circle1Brush.point = 0.5;
        square0.addBrush(circle1Brush);
        circ.addShape(square0);
        circ.addShape(square1);
        return circ;
    };
    BlueprintStore.prototype.makeTwoPolygons = function () {
        var circ = new circ_1.Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var poly0 = new polygon_1.Polygon();
        poly0.steps = 1000;
        poly0.outside = true;
        poly0.fixed = true;
        poly0.clockwise = false;
        poly0.stepMod = 0;
        poly0.startAngle = 0;
        poly0.faces = 3;
        poly0.faceWidth = 250;
        var poly1 = new polygon_1.Polygon();
        poly1.steps = 500;
        poly1.outside = true;
        poly1.fixed = true;
        poly1.clockwise = true;
        poly1.stepMod = 0;
        poly1.startAngle = 0;
        poly1.faces = 1000;
        poly1.faceWidth = 0.5;
        var poly2 = new polygon_1.Polygon();
        poly2.steps = 1000;
        poly2.outside = true;
        poly2.fixed = true;
        poly2.clockwise = true;
        poly2.stepMod = 0;
        poly2.startAngle = 0;
        poly2.faces = 500;
        poly2.faceWidth = 0.5;
        var circle1Brush = new brushes_1.Brush();
        circle1Brush.color = '#FFFFFF';
        circle1Brush.degrees = 0;
        circle1Brush.link = false;
        circle1Brush.offset = 0;
        circle1Brush.point = 0.5;
        poly2.addBrush(circle1Brush);
        circ.addShape(poly0);
        circ.addShape(poly1);
        circ.addShape(poly2);
        return circ;
    };
    return BlueprintStore;
}());
exports.BlueprintStore = BlueprintStore;
