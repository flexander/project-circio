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
            'polygons': this.makePolygons,
            'polygonsB': this.makePolygonsB,
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
    BlueprintStore.prototype.makePolygons = function () {
        var circ = new circ_1.Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var poly0 = new polygon_1.Polygon();
        poly0.steps = 500;
        poly0.outside = true;
        poly0.fixed = true;
        poly0.clockwise = false;
        poly0.stepMod = 0;
        poly0.startAngle = 0;
        poly0.faces = 300;
        poly0.faceWidth = 0.5;
        var poly1 = new polygon_1.Polygon();
        poly1.steps = 500;
        poly1.outside = true;
        poly1.fixed = true;
        poly1.clockwise = true;
        poly1.stepMod = 0;
        poly1.startAngle = 0;
        poly1.faces = 3;
        poly1.faceWidth = 100;
        var poly2 = new polygon_1.Polygon();
        poly2.steps = 500;
        poly2.outside = true;
        poly2.fixed = true;
        poly2.clockwise = false;
        poly2.stepMod = 0;
        poly2.startAngle = 0;
        poly2.faces = 600;
        poly2.faceWidth = 0.5;
        var poly3 = new polygon_1.Polygon();
        poly3.steps = 500;
        poly3.outside = true;
        poly3.fixed = true;
        poly3.clockwise = true;
        poly3.stepMod = 0;
        poly3.startAngle = 0;
        poly3.faces = 6;
        poly3.faceWidth = 100;
        var circle1Brush = new brushes_1.Brush();
        circle1Brush.color = '#FFFFFF';
        circle1Brush.degrees = 0;
        circle1Brush.link = false;
        circle1Brush.offset = 0;
        circle1Brush.point = 0.5;
        poly3.addBrush(circle1Brush);
        circ.addShape(poly0);
        circ.addShape(poly1);
        circ.addShape(poly2);
        circ.addShape(poly3);
        return circ;
    };
    BlueprintStore.prototype.makePolygonsB = function () {
        var circ = new circ_1.Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#000000';
        var poly0 = new polygon_1.Polygon();
        poly0.steps = 0;
        poly0.outside = true;
        poly0.fixed = true;
        poly0.clockwise = false;
        poly0.stepMod = 0;
        poly0.startAngle = 0;
        poly0.faces = 500;
        poly0.faceWidth = 0.5;
        var poly1 = new polygon_1.Polygon();
        poly1.steps = 500;
        poly1.outside = true;
        poly1.fixed = true;
        poly1.clockwise = true;
        poly1.stepMod = 0;
        poly1.startAngle = 0;
        poly1.faces = 2;
        poly1.faceWidth = 50;
        var poly2 = new polygon_1.Polygon();
        poly2.steps = 500;
        poly2.outside = true;
        poly2.fixed = true;
        poly2.clockwise = true;
        poly2.stepMod = 0;
        poly2.startAngle = 0;
        poly2.faces = 2;
        poly2.faceWidth = 50;
        var poly3 = new polygon_1.Polygon();
        poly3.steps = 500;
        poly3.outside = true;
        poly3.fixed = true;
        poly3.clockwise = true;
        poly3.stepMod = 0;
        poly3.startAngle = 0;
        poly3.faces = 2;
        poly3.faceWidth = 50;
        var poly4 = new polygon_1.Polygon();
        poly4.steps = 500;
        poly4.outside = true;
        poly4.fixed = true;
        poly4.clockwise = true;
        poly4.stepMod = 0;
        poly4.startAngle = 0;
        poly4.faces = 2;
        poly4.faceWidth = 50;
        var poly5 = new polygon_1.Polygon();
        poly5.steps = 500;
        poly5.outside = true;
        poly5.fixed = true;
        poly5.clockwise = true;
        poly5.stepMod = 0;
        poly5.startAngle = 0;
        poly5.faces = 2;
        poly5.faceWidth = 50;
        var poly6 = new polygon_1.Polygon();
        poly6.steps = 500;
        poly6.outside = true;
        poly6.fixed = true;
        poly6.clockwise = true;
        poly6.stepMod = 0;
        poly6.startAngle = 0;
        poly6.faces = 2;
        poly6.faceWidth = 50;
        var brush0 = new brushes_1.Brush();
        brush0.color = '#93ff3c';
        brush0.degrees = 0;
        brush0.link = false;
        brush0.offset = 0;
        brush0.point = 0.5;
        circ.addShape(poly0);
        circ.addShape(poly1);
        circ.addShape(poly2);
        circ.addShape(poly3);
        circ.addShape(poly4);
        circ.addShape(poly5);
        circ.addShape(poly6);
        circ.getEndShape().addBrush(brush0);
        return circ;
    };
    return BlueprintStore;
}());
exports.BlueprintStore = BlueprintStore;
