"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = require("./circle");
describe('Circle', function () {
    describe('constructor', function () {
        it('should create a valid circle', function () {
            var circle = new circle_1.Circle();
            expect(circle).not.toBe(null);
        });
    });
    describe('get/set radius', function () {
        var circle;
        var radius = 10;
        beforeEach(function () {
            circle = new circle_1.Circle();
        });
        describe('set radius', function () {
            it('should set the radius', function () {
                circle.radius = radius;
                expect(circle.config.radius).toEqual(radius);
            });
            it('should not allow the radius to be zero', function () {
                expect(function (_) { circle.radius = 0; }).toThrow();
            });
            it('should not allow the radius to be non-numeric', function () {
                expect(function (_) { circle.radius = 'radius'; }).toThrow();
            });
        });
        describe('get radius', function () {
            it('should get the name', function () {
                circle.config.radius = radius;
                expect(circle.radius).toEqual(radius);
            });
        });
    });
});
