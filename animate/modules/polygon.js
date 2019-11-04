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
var math = require("mathjs");
var circle_1 = require("./circle");
var cloneDeep = require('lodash.clonedeep');
var Polygon = /** @class */ (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super.call(this) || this;
        _this.brushes = [];
        _this.state = new PolygonState();
        _this.config = new PolygonConfig();
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
            var parentCentreToContactPoint = parentSAS.a;
            var angleFromOrigin = parentPolygon.state.totalAngle + parentSAS.C;
            var angleRelativeToParent = 0; //this.getCornersPassed(parentPolygon) * parentPolygon.getInnerAngle();
            var contactPointX = (parentCentreToContactPoint * Math.cos(angleFromOrigin + angleRelativeToParent)) + parentCentreX;
            var contactPointY = (parentCentreToContactPoint * Math.sin(angleFromOrigin + angleRelativeToParent)) + parentCentreY;
            // calculate child centre contact point
            var childSAS = this.getValuesFromSAS(this.getRadius(), // side b
            (this.getOuterAngle() / 2), // angle A
            Math.abs(this.getDistanceFromChildCornerToContact(parentPolygon)) // side c
            );
            var childCentreToContactPoint = childSAS.a;
            // If parentSasC = 0 then the child is on a corner
            var parentSASB = (parentSAS.C !== 0) ? parentSAS.B : (parentPolygon.getOuterAngle() / 2);
            var relativeAngle = (
            // TODO: this calc might be wrong
            //(((this.state.totalAngle + this.getOffsetRadians(parentPolygon)) - (this.getCornersPassed(parentPolygon) * parentPolygon.getExternalAngle())) % this.getRadiansPerFace()) +
            childSAS.B +
                parentSASB);
            var relativeSAS = this.getValuesFromSAS(parentCentreToContactPoint, // side b
            relativeAngle, // angle A
            childCentreToContactPoint // side c
            );
            radiusRelative = relativeSAS.a;
            arcToParentRadians = (this.config.clockwise === true) ? -(relativeSAS.C) : relativeSAS.C;
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
    Polygon.prototype.getRatio = function (parentPolygon) {
        return math.fraction(parentPolygon.faceWidth, this.faceWidth);
    };
    Polygon.prototype.getOffsetRadians = function (parentPolygon) {
        // The angle between the active parent face and active child face
        var initialAngle = 0;
        if (this.faces % 2 !== 0) {
            initialAngle = (Math.PI - parentPolygon.getOuterAngle()) / 2;
        }
        else {
            initialAngle = ((Math.PI * 2) - this.getOuterAngle() - parentPolygon.getOuterAngle()) / 2;
        }
        return this.getExternalAngle() - initialAngle;
    };
    Polygon.prototype.getOffsetDistance = function () {
        var offset = this.faceWidth;
        if (this.faces % 2 !== 0) {
            offset /= 2;
        }
        return offset;
    };
    Polygon.prototype.getSequenceGroupRadians = function (parentPolygon) {
        var ratio = this.getRatio(parentPolygon);
        var childFacesInGroup = ratio.n;
        var groupSize = ratio.d;
        var cornerRadians = parentPolygon.getExternalAngle() * groupSize;
        var faceRadians = this.getRadiansPerFace() * childFacesInGroup;
        return cornerRadians + faceRadians;
    };
    Polygon.prototype.getSequenceGroup = function (parentPolygon) {
        return math.floor(this.state.totalAngle / this.getSequenceGroupRadians(parentPolygon));
    };
    Polygon.prototype.getSequence = function (parentPolygon) {
        var ratio = this.getRatio(parentPolygon);
        var sequence = [];
        var maxValue = math.ceil(math.number(ratio));
        var offset = this.getOffsetDistance();
        var offsetDistance = offset;
        for (var parentIndex = 0; parentIndex < ratio.d; parentIndex++) {
            for (var childIndex = 0; childIndex < maxValue; childIndex++) {
                var distance = offsetDistance + (childIndex * this.faceWidth);
                if (distance > ((parentIndex + 1) * parentPolygon.faceWidth)) {
                    sequence.push(childIndex);
                    var sequenceSum = sequence.reduce(function (sum, value) { return sum + value; });
                    offsetDistance = offset + (sequenceSum * this.faceWidth);
                    break;
                }
            }
        }
        console.log('seq: ' + sequence);
        return sequence;
    };
    Polygon.prototype.getCornersPassed = function (parentPolygon) {
        var cornersPassed = 0;
        var sequence = this.getSequence(parentPolygon);
        return cornersPassed;
    };
    Polygon.prototype.getDistanceFromOriginToContact = function (parentPolygon) {
        return 0;
    };
    Polygon.prototype.getParentDistanceFromOriginToContact = function (parentPolygon) {
        return 0;
    };
    Polygon.prototype.getDistanceFromParentCornerToContact = function (parentPolygon) {
        var cornersPassed = this.getCornersPassed(parentPolygon);
        return 0;
    };
    Polygon.prototype.getDistanceFromChildCornerToContact = function (parentPolygon) {
        return 0;
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
var PolygonConfigDefault = /** @class */ (function () {
    function PolygonConfigDefault() {
        var _newTarget = this.constructor;
        this.steps = 500;
        this.outside = true;
        this.fixed = true;
        this.clockwise = true;
        this.stepMod = 0;
        this.startAngle = 0;
        this.isRoot = false;
        if (_newTarget === circle_1.CircleConfigDefault) {
            Object.freeze(this);
        }
    }
    return PolygonConfigDefault;
}());
var PolygonConfig = /** @class */ (function (_super) {
    __extends(PolygonConfig, _super);
    function PolygonConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PolygonConfig;
}(PolygonConfigDefault));
