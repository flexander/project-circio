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
var cloneDeep = require('lodash.clonedeep');
var Polygon = /** @class */ (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super.call(this) || this;
        _this.brushes = [];
        _this.state = new PolygonState();
        _this.id = Math.floor(Math.random() * 100000);
        _this.saveInitialState();
        return _this;
    }
    Polygon.prototype.calculatePosition = function (parentPolygon) {
        this.savePreviousState();
        var arcToParentRadians = 0;
        var parentRadians = parentPolygon !== null && this.fixed === true ? parentPolygon.state.getAngle() : 0;
        var radiusRelative = 0;
        var parentCentreX = this.state.centre.x;
        var parentCentreY = this.state.centre.y;
        if (parentPolygon !== null) {
            // TODO: calculate parent centre contact point
            var parentSAS = this.getValuesFromSAS(parentPolygon.getRadius(), // b
            (parentPolygon.getOuterAngle() / 2), // A
            this.getDistanceFromContactToParentCorner(parentPolygon) // C
            );
            var parentCentreToContactPoint = parentSAS.a;
            // TODO: calculate child centre contact point
            var childSAS = this.getValuesFromSAS(this.getRadius(), // b
            (this.getOuterAngle() / 2), // A
            this.getDistanceFromContactToChildCorner(parentPolygon) // C
            );
            var childCentreToContactPoint = childSAS.a;
            // TODO: calculate center relative to parent
        }
        this.state.centre.x = parentCentreX + (Math.cos(parentRadians + arcToParentRadians) * radiusRelative);
        this.state.centre.y = parentCentreY + (Math.sin(parentRadians + arcToParentRadians) * radiusRelative);
        // New x1 & y1 to reflect change in radians
        this.state.drawPoint.x = this.state.centre.x + (Math.cos(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
        this.state.drawPoint.y = this.state.centre.y + (Math.sin(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
    };
    Polygon.prototype.calculateAngle = function () {
        this.state.previousState.totalAngle = this.state.totalAngle;
        if (this.clockwise === true) {
            this.state.totalAngle += this.getStepRadians();
        }
        else {
            this.state.totalAngle -= this.getStepRadians();
        }
    };
    Polygon.prototype.savePreviousState = function () {
        this.state.previousState = cloneDeep(this.state);
        delete this.state.previousState.previousState;
    };
    Polygon.prototype.saveInitialState = function () {
        this.state.initialState = cloneDeep(this.state);
    };
    Polygon.prototype.getStepRadians = function () {
        var stepRadian = 0;
        if (this.steps > 0) {
            stepRadian = (Math.PI * 2) / this.steps;
        }
        return stepRadian;
    };
    Polygon.prototype.getStepCount = function () {
        var stepCount = 0;
        if (this.steps > 0) {
            stepCount = this.state.totalAngle / this.getStepRadians();
        }
        return stepCount;
    };
    Polygon.prototype.reset = function () {
        this.state = cloneDeep(this.state.initialState);
        // Create a new initial state object
        this.saveInitialState();
    };
    Polygon.prototype.addBrush = function (brush) {
        this.brushes.push(brush);
    };
    Polygon.prototype.getBrushes = function () {
        return this.brushes;
    };
    Polygon.prototype.getRadius = function () {
        return this.faceWidth / (2 * Math.sin(Math.PI / this.faces));
    };
    Polygon.prototype.getInRadius = function () {
        return this.faceWidth / (2 * Math.tan(Math.PI / this.faces));
    };
    Polygon.prototype.getInnerAngle = function () {
        return (2 * Math.PI) / this.faces;
    };
    Polygon.prototype.getOuterAngle = function () {
        return Math.PI - this.getInnerAngle();
    };
    Polygon.prototype.getExternalAngle = function () {
        return this.getInnerAngle();
    };
    Polygon.prototype.getRadiansPerFace = function () {
        return this.getInnerAngle();
    };
    Polygon.prototype.getFacesPerParentFace = function (parentPolygon) {
        return Math.ceil(parentPolygon.faceWidth / this.faceWidth);
    };
    Polygon.prototype.getRadiansPerParentFace = function (parentPolygon) {
        return this.getInnerAngle() * this.getFacesPerParentFace(parentPolygon);
    };
    Polygon.prototype.getCornersPassed = function (parentPolygon) {
        var offset = this.getOffsetRadians(parentPolygon);
        return Math.floor((this.state.totalAngle - offset) / (this.getRadiansPerParentFace(parentPolygon) + parentPolygon.getExternalAngle()));
    };
    Polygon.prototype.isOnCorner = function (parentPolygon) {
        var baseValue = this.getRadiansPerParentFace(parentPolygon) + this.getOffsetRadians(parentPolygon);
        var minRadians = baseValue + (this.getRadiansPerParentFace(parentPolygon) * this.getCornersPassed(parentPolygon));
        var maxRadians = minRadians + parentPolygon.getExternalAngle();
        return (this.state.totalAngle > minRadians && this.state.totalAngle < maxRadians);
    };
    Polygon.prototype.getOffsetRadians = function (parentPolygon) {
        var offset = 0;
        if (this.faces % 2 !== 0) {
            offset = (parentPolygon.getExternalAngle() / 2);
        }
        return offset;
    };
    Polygon.prototype.getOffsetDistance = function (parentPolygon) {
        var offset = 0;
        if (this.faces % 2 !== 0) {
            offset = this.faceWidth / 2;
        }
        return offset;
    };
    Polygon.prototype.getDistanceFromOrigin = function (parentPolygon) {
        // TODO: Take offset into account
        var distance;
        if (this.isOnCorner(parentPolygon)) {
            distance = (this.getCornersPassed(parentPolygon) + 1) * parentPolygon.faceWidth;
        }
        else {
            var flattenedTotalAngle = this.state.totalAngle - ((this.getCornersPassed(parentPolygon)) * parentPolygon.getExternalAngle());
            distance = Math.floor(flattenedTotalAngle / this.getRadiansPerFace()) * this.faceWidth;
        }
        return distance;
    };
    Polygon.prototype.getDistanceFromContactToParentCorner = function (parentPolygon) {
        return this.getDistanceFromOrigin(parentPolygon) % parentPolygon.faceWidth;
    };
    Polygon.prototype.getDistanceFromContactToChildCorner = function (parentPolygon) {
        return this.getDistanceFromOrigin(parentPolygon) % this.faceWidth;
    };
    // Calculate values of a triangle where we know two sides and the angle between them
    Polygon.prototype.getValuesFromSAS = function (sideB, angleA, sideC) {
        var sideA; // a
        var angleB; // B
        var angleC; // C
        // a^2 = b^2 + c^2 − 2bc cosA
        sideA = Math.sqrt(Math.pow(sideB, 2) + Math.pow(sideC, 2) - (2 * sideB * sideC * Math.cos(angleA)));
        var smallAngle = Math.asin((Math.sin(angleA) * Math.min(sideB, sideC)) / sideA);
        var largeAngle = Math.PI - smallAngle;
        if (sideB < sideC) {
            angleB = smallAngle;
            angleC = largeAngle;
        }
        else {
            angleC = smallAngle;
            angleB = largeAngle;
        }
        var polygonSas = new PolygonSas();
        polygonSas.a = sideA;
        polygonSas.b = sideB;
        polygonSas.c = sideC;
        polygonSas.A = angleA;
        polygonSas.B = angleB;
        polygonSas.C = angleC;
        return polygonSas;
    };
    return Polygon;
}(structure_1.EventEmitter));
exports.Polygon = Polygon;
var PolygonState = /** @class */ (function () {
    function PolygonState() {
        this.centre = new PolygonCenterPosition();
        this.drawPoint = new PolygonDrawPosition();
        this.initialState = Object.create(this);
        this.previousState = null;
        this.totalAngle = 0;
    }
    PolygonState.prototype.getAngle = function () {
        return Math.atan2((this.drawPoint.y - this.centre.y), // Delta Y
        (this.drawPoint.x - this.centre.x) // Delta X
        );
    };
    return PolygonState;
}());
exports.PolygonState = PolygonState;
var PolygonCenterPosition = /** @class */ (function () {
    function PolygonCenterPosition() {
        this.x = 0;
        this.y = 0;
    }
    return PolygonCenterPosition;
}());
exports.PolygonCenterPosition = PolygonCenterPosition;
var PolygonDrawPosition = /** @class */ (function () {
    function PolygonDrawPosition() {
    }
    return PolygonDrawPosition;
}());
exports.PolygonDrawPosition = PolygonDrawPosition;
var PolygonSas = /** @class */ (function () {
    function PolygonSas() {
    }
    return PolygonSas;
}());
