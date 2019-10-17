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
        var parentRadians = (parentPolygon !== null && this.fixed === true) ? parentPolygon.state.totalAngle : 0;
        var radiusRelative = 0;
        var parentCentreX = this.state.centre.x;
        var parentCentreY = this.state.centre.y;
        if (parentPolygon !== null) {
            this.parent = parentPolygon;
            parentCentreX = parentPolygon.state.centre.x;
            parentCentreY = parentPolygon.state.centre.y;
            // calculate parent centre contact point
            var parentSAS = this.getValuesFromSAS(parentPolygon.getRadius(), // side b
            (parentPolygon.getOuterAngle() / 2), // angle A
            this.getDistanceFromParentCornerToContact(parentPolygon) // side c
            );
            console.log('distance from parent to corner: ' + this.getDistanceFromParentCornerToContact(parentPolygon));
            var parentCentreToContactPoint = parentSAS.a;
            var angleFromOrigin = parentPolygon.state.totalAngle + parentSAS.C;
            var angleRelativeToParent = this.getCornersPassed(parentPolygon) * parentPolygon.getInnerAngle();
            var contactPointX = (parentCentreToContactPoint * Math.cos(angleFromOrigin + angleRelativeToParent)) + parentCentreX;
            var contactPointY = (parentCentreToContactPoint * Math.sin(angleFromOrigin + angleRelativeToParent)) + parentCentreY;
            console.log('------');
            // calculate child centre contact point
            var childSAS = this.getValuesFromSAS(this.getRadius(), // side b
            (this.getOuterAngle() / 2), // angle A
            Math.abs(this.getDistanceFromChildCornerToContact(parentPolygon)) // side c
            );
            console.log('------');
            var childCentreToContactPoint = childSAS.a;
            // If parentSasC = 0 then the child is on a corner
            var parentSASB = (parentSAS.C !== 0) ? parentSAS.B : (parentPolygon.getOuterAngle() / 2);
            var relativeAngle = (
            // TODO: this calc might be wrong
            (((this.state.totalAngle + this.getOffsetRadians(parentPolygon)) - (this.getCornersPassed(parentPolygon) * parentPolygon.getExternalAngle())) % this.getRadiansPerFace()) +
                childSAS.B +
                parentSASB);
            var relativeSAS = this.getValuesFromSAS(parentCentreToContactPoint, // side b
            relativeAngle, // angle A
            childCentreToContactPoint // side c
            );
            radiusRelative = relativeSAS.a;
            arcToParentRadians = relativeSAS.C;
            this.state.contactPoint.x = contactPointX;
            this.state.contactPoint.y = contactPointY;
        }
        this.state.centre.x = parentCentreX + (Math.cos(parentRadians + arcToParentRadians) * radiusRelative);
        this.state.centre.y = parentCentreY + (Math.sin(parentRadians + arcToParentRadians) * radiusRelative);
        // New x1 & y1 to reflect change in radians
        this.state.drawPoint.x = this.state.centre.x + (Math.cos(parentRadians + arcToParentRadians + this.state.totalAngle) * this.getRadius());
        this.state.drawPoint.y = this.state.centre.y + (Math.sin(parentRadians + arcToParentRadians + this.state.totalAngle) * this.getRadius());
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
    Polygon.prototype.getOffsetRadians = function (parentPolygon) {
        // The angle between the active parent face and active child face
        var initialAngle = 0;
        if (this.faces % 2 !== 0) {
            initialAngle = (Math.PI - parentPolygon.getOuterAngle()) / 2;
        }
        else {
            initialAngle = ((Math.PI * 2) - this.getOuterAngle() + parentPolygon.getOuterAngle()) / 2;
        }
        return this.getExternalAngle() - initialAngle;
    };
    Polygon.prototype.getOffsetDistance = function () {
        var offset = 0;
        if (this.faces % 2 !== 0) {
            offset = this.faceWidth / 2;
        }
        return offset;
    };
    Polygon.prototype.getCornersPassed = function (parentPolygon) {
        var offset = this.getOffsetRadians(parentPolygon);
        return Math.floor((this.state.totalAngle + offset) / (this.getRadiansPerParentFace(parentPolygon) + parentPolygon.getExternalAngle()));
    };
    Polygon.prototype.isOnCorner = function (parentPolygon) {
        var offset = this.getOffsetRadians(parentPolygon);
        var baseValue = this.getRadiansPerParentFace(parentPolygon) + offset;
        var minRadians = baseValue + (this.getRadiansPerParentFace(parentPolygon) * this.getCornersPassed(parentPolygon));
        var maxRadians = minRadians + parentPolygon.getExternalAngle();
        return (this.state.totalAngle > minRadians && this.state.totalAngle < maxRadians);
    };
    Polygon.prototype.getDistanceFromOriginToContact = function (parentPolygon) {
        var offsetRadians = this.getOffsetRadians(parentPolygon);
        var offsetDistance = this.getOffsetDistance();
        var distance;
        if (this.isOnCorner(parentPolygon)) {
            distance = (this.getCornersPassed(parentPolygon) + 1) * parentPolygon.faceWidth;
            console.log('on corner dist: ' + distance);
        }
        else {
            var flattenedTotalAngle = (this.state.totalAngle + offsetRadians) - (this.getCornersPassed(parentPolygon) * parentPolygon.getExternalAngle());
            distance = (Math.floor(flattenedTotalAngle / this.getRadiansPerFace()) * this.faceWidth) - offsetDistance;
            console.log('not on corner dist: ' + distance);
        }
        return distance;
    };
    Polygon.prototype.getParentDistanceFromOriginToContact = function (parentPolygon) {
        var offsetRadians = this.getOffsetRadians(parentPolygon);
        var offsetDistance = this.getOffsetDistance();
        var distance = 0;
        // Initial corner
        if (offsetRadians > this.state.totalAngle) {
            return distance;
        }
        else {
            distance = this.getDistanceFromOriginToContact(parentPolygon);
        }
        return distance;
    };
    Polygon.prototype.getDistanceFromParentCornerToContact = function (parentPolygon) {
        var originDistance = this.getParentDistanceFromOriginToContact(parentPolygon);
        console.log('parent dist from origin: ' + originDistance);
        var distance = originDistance - (parentPolygon.faceWidth * this.getCornersPassed(parentPolygon));
        console.log('parent distance: ' + distance);
        return distance;
    };
    Polygon.prototype.getDistanceFromChildCornerToContact = function (parentPolygon) {
        var originDistance = this.getDistanceFromOriginToContact(parentPolygon);
        console.log('child dist from origin: ' + originDistance);
        var distance = originDistance - (parentPolygon.faceWidth * this.getCornersPassed(parentPolygon));
        console.log('child distance: ' + distance);
        return distance;
    };
    // Calculate values of a triangle where we know two sides and the angle between them
    Polygon.prototype.getValuesFromSAS = function (sideB, angleA, sideC) {
        var sideA; // a
        var angleB; // B
        var angleC; // C
        // a^2 = b^2 + c^2 − 2bc cosA
        sideA = Math.sqrt(Math.pow(sideB, 2) + Math.pow(sideC, 2) - (2 * sideB * sideC * Math.cos(angleA)));
        var smallAngle = Math.asin((Math.sin(angleA) * Math.min(sideB, sideC)) / sideA);
        var largeAngle = Math.PI - smallAngle - angleA;
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
        this.contactPoint = new PolygonContactPosition();
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
var PolygonContactPosition = /** @class */ (function () {
    function PolygonContactPosition() {
    }
    return PolygonContactPosition;
}());
var PolygonSas = /** @class */ (function () {
    function PolygonSas() {
    }
    return PolygonSas;
}());
