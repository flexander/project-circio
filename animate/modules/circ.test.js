"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circ_1 = require("./circ");
var circle_1 = require("./circle");
var events_1 = require("./events");
describe('Circ', function () {
    describe('constructor', function () {
        it('should create a valid circ', function () {
            var circ = new circ_1.Circ();
            expect(circ).not.toBe(null);
        });
    });
    describe('addShape', function () {
        var circ;
        var shape1;
        beforeEach(function () {
            circ = new circ_1.Circ();
            circ.dispatchEvent = jest.fn();
            shape1 = new circle_1.Circle();
        });
        beforeEach(function () {
            circ.addShape(shape1);
        });
        it('should set the isRoot property of the first shape to true', function () {
            expect(shape1.isRoot).toEqual(true);
        });
        it('should set the isRoot property of the second shape to false', function () {
            var shape2 = new circle_1.Circle();
            circ.addShape(shape2);
            expect(shape2.isRoot).toEqual(false);
        });
        it('should add the shape to the shapes array', function () {
            var expectedShapes = [shape1];
            expect(circ.getShapes()).toEqual(expectedShapes);
        });
        it('should call the dispatchEvent exactly once with the shape', function () {
            expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
            expect(circ.dispatchEvent).toHaveBeenCalledWith(new events_1.ShapeAddEvent(shape1));
        });
    });
    describe('removeShape', function () {
        var circ;
        var shape1;
        beforeEach(function () {
            circ = new circ_1.Circ();
            circ.dispatchEvent = jest.fn();
            shape1 = new circle_1.Circle();
        });
        it('should not call the dispatchEvent', function () {
            circ.shapes.push(shape1);
            circ.removeShape(shape1.id);
            expect(circ.dispatchEvent).not.toHaveBeenCalled();
        });
        it('should call the dispatchEvent exactly once with the shape', function () {
            circ.shapes.push(shape1);
            circ.removeShape(shape1.id + 1);
            expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
            expect(circ.dispatchEvent).toHaveBeenCalledWith(new events_1.ShapeDeleteEvent(shape1));
        });
        it('should call the dispatchEvent twice with the shapes', function () {
            var _a;
            var shape2 = new circle_1.Circle();
            (_a = circ.shapes).push.apply(_a, [shape1, shape2]);
            circ.removeShape(shape1.id + 1);
            expect(circ.dispatchEvent).toHaveBeenCalledTimes(2);
            expect(circ.dispatchEvent).toHaveBeenCalledWith(new events_1.ShapeDeleteEvent(shape1));
            expect(circ.dispatchEvent).toHaveBeenCalledWith(new events_1.ShapeDeleteEvent(shape2));
        });
    });
    describe('getShapes', function () {
        var circ;
        var shape1;
        beforeEach(function () {
            circ = new circ_1.Circ();
            shape1 = new circle_1.Circle();
        });
        it('should return the shapes', function () {
            circ.shapes.push(shape1);
            expect(circ.getShapes()).toEqual([shape1]);
        });
    });
    describe('get/set name', function () {
        var circ;
        var name = 'testName';
        beforeEach(function () {
            circ = new circ_1.Circ();
            circ.dispatchEvent = jest.fn();
        });
        describe('set name', function () {
            it('should set the name', function () {
                circ.name = name;
                expect(circ.config.name).toEqual(name);
            });
            it('should call the dispatchEvent exactly once with the correct AttributeChangedEvent', function () {
                circ.name = name;
                expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
                expect(circ.dispatchEvent).toHaveBeenCalledWith(new events_1.AttributeChangedEvent('name', name));
            });
        });
        describe('get name', function () {
            it('should get the name', function () {
                circ.config.name = name;
                expect(circ.name).toEqual(name);
            });
        });
    });
    describe('get/set height', function () {
        var circ;
        var height = 9000;
        beforeEach(function () {
            circ = new circ_1.Circ();
            circ.dispatchEvent = jest.fn();
        });
        describe('set height', function () {
            it('should set the height', function () {
                circ.height = height;
                expect(circ.config.height).toEqual(height);
            });
            it('should call the dispatchEvent exactly once with the correct AttributeChangedEvent', function () {
                circ.height = height;
                expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
                expect(circ.dispatchEvent).toHaveBeenCalledWith(new events_1.AttributeChangedEvent('height', height));
            });
        });
        describe('get height', function () {
            it('should get the height', function () {
                circ.config.height = height;
                expect(circ.height).toEqual(height);
            });
        });
    });
    describe('get/set width', function () {
        var circ;
        var width = 123;
        beforeEach(function () {
            circ = new circ_1.Circ();
            circ.dispatchEvent = jest.fn();
        });
        describe('set width', function () {
            it('should set the width', function () {
                circ.width = width;
                expect(circ.config.width).toEqual(width);
            });
            it('should call the dispatchEvent exactly once with the correct AttributeChangedEvent', function () {
                circ.width = width;
                expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
                expect(circ.dispatchEvent).toHaveBeenCalledWith(new events_1.AttributeChangedEvent('width', width));
            });
        });
        describe('get width', function () {
            it('should get the width', function () {
                circ.config.width = width;
                expect(circ.width).toEqual(width);
            });
        });
    });
    describe('get/set backgroundFill', function () {
        var circ;
        var backgroundFill = '#black';
        beforeEach(function () {
            circ = new circ_1.Circ();
            circ.dispatchEvent = jest.fn();
        });
        describe('set backgroundFill', function () {
            it('should set the backgroundFill', function () {
                circ.backgroundFill = backgroundFill;
                expect(circ.config.backgroundFill).toEqual(backgroundFill);
            });
            it('should call the dispatchEvent exactly once with the correct AttributeChangedEvent', function () {
                circ.backgroundFill = backgroundFill;
                expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
                expect(circ.dispatchEvent).toHaveBeenCalledWith(new events_1.AttributeChangedEvent('backgroundFill', backgroundFill));
            });
        });
        describe('get backgroundFill', function () {
            it('should get the backgroundFill', function () {
                circ.config.backgroundFill = backgroundFill;
                expect(circ.backgroundFill).toEqual(backgroundFill);
            });
        });
    });
    describe('get modified', function () {
        var circ;
        var modified = true;
        beforeEach(function () {
            circ = new circ_1.Circ();
            circ.dispatchEvent = jest.fn();
        });
        it('should get the modified value', function () {
            circ.config.modified = modified;
            expect(circ.modified).toEqual(modified);
        });
    });
    describe('get stepsToComplete', function () {
        var circ;
        var shape;
        var motionlessShape;
        beforeEach(function () {
            circ = new circ_1.Circ();
            shape = new circle_1.Circle();
            motionlessShape = new circle_1.Circle();
            motionlessShape.steps = 0;
        });
        beforeEach(function () {
            circ = new circ_1.Circ();
            circ.dispatchEvent = jest.fn();
        });
        it('should not throw an error', function () {
            circ.shapes = [motionlessShape, shape, shape];
            expect(function () { circ.stepsToComplete; }).not.toThrowError();
        });
        it('should return infinity for Circs that don\'t end quick enough', function () {
            var shape1 = new circle_1.Circle();
            shape1.radius = 150;
            shape1.steps = 0;
            var shape2 = new circle_1.Circle();
            shape2.radius = 201;
            shape2.steps = 523;
            var shape3 = new circle_1.Circle();
            shape3.radius = 233;
            shape3.steps = 911;
            circ.addShape(shape1);
            circ.addShape(shape2);
            circ.addShape(shape3);
            expect(circ.stepsToComplete).toBe(Infinity);
        });
        it('should calculate steps correctly for 3 shapes', function () {
            var shape1 = new circle_1.Circle();
            shape1.radius = 150;
            shape1.steps = 0;
            var shape2 = new circle_1.Circle();
            shape2.radius = 105;
            shape2.steps = 1098;
            var shape3 = new circle_1.Circle();
            shape3.radius = 245;
            shape3.steps = 915;
            circ.addShape(shape1);
            circ.addShape(shape2);
            circ.addShape(shape3);
            expect(circ.stepsToComplete).toBe(10980);
        });
        it('should calculate steps correctly for 2 shapes', function () {
            var shape1 = new circle_1.Circle();
            shape1.radius = 150;
            shape1.steps = 0;
            var shape2 = new circle_1.Circle();
            shape2.radius = 120;
            shape2.steps = 400;
            circ.addShape(shape1);
            circ.addShape(shape2);
            expect(circ.stepsToComplete).toBe(2000);
        });
        it('should calculate steps correctly for 4 shapes', function () {
            var shape1 = new circle_1.Circle();
            shape1.radius = 150;
            shape1.steps = 0;
            var shape2 = new circle_1.Circle();
            shape2.radius = 70;
            shape2.steps = 228;
            var shape3 = new circle_1.Circle();
            shape3.radius = 112;
            shape3.steps = 76;
            var shape4 = new circle_1.Circle();
            shape4.radius = 196;
            shape4.steps = 57;
            circ.addShape(shape1);
            circ.addShape(shape2);
            circ.addShape(shape3);
            circ.addShape(shape4);
            expect(circ.stepsToComplete).toBe(3420);
        });
        it('should calculate steps correctly with moving roots', function () {
            var shape1 = new circle_1.Circle();
            shape1.radius = 150;
            shape1.steps = 756;
            var shape2 = new circle_1.Circle();
            shape2.radius = 60;
            shape2.steps = 504;
            var shape3 = new circle_1.Circle();
            shape3.radius = 240;
            shape3.steps = 567;
            circ.addShape(shape1);
            circ.addShape(shape2);
            circ.addShape(shape3);
            expect(circ.stepsToComplete).toBe(22680);
        });
    });
});
