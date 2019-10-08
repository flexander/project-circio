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
        var arc = this.getArc();
        var stepCount = this.getStepCount();
        var distanceTravelled = arc * stepCount;
        var arcToParentRadians = 0;
        var parentRadians = parentPolygon !== null && this.fixed === true ? parentPolygon.state.getAngle() : 0;
        var radiusRelative = 0;
        var parentCentreX = this.state.centre.x;
        var parentCentreY = this.state.centre.y;
        if (parentPolygon !== null) {
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
    Polygon.prototype.getArc = function () {
        if (this.steps === 0) {
            return 0;
        }
        return this.radius * this.getStepRadians();
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
