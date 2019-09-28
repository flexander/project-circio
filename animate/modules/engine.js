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
var structure_1 = require("../structure");
var events_1 = require("./events");
var Engine = /** @class */ (function (_super) {
    __extends(Engine, _super);
    function Engine() {
        var _this = _super.call(this) || this;
        _this.totalStepsRun = 0;
        _this.interval = 1;
        _this.stepCallbacks = [];
        _this.resetCallbacks = [];
        _this.importCallbacks = [];
        _this.stepsToRun = 0;
        _this.run();
        return _this;
    }
    Engine.prototype.addStepCallback = function (callback) {
        this.stepCallbacks.push(callback);
    };
    Engine.prototype.addResetCallback = function (callback) {
        this.resetCallbacks.push(callback);
    };
    Engine.prototype.addImportCallback = function (callback) {
        this.importCallbacks.push(callback);
    };
    Engine.prototype.export = function () {
        return this.circ;
    };
    Engine.prototype.import = function (circ) {
        this.circ = circ;
        this.reset();
        this.runImportCallbacks();
    };
    Engine.prototype.pause = function () {
        this.stepsToRun = 0;
        this.dispatchEvent(new events_1.EnginePauseEvent());
    };
    Engine.prototype.play = function (count) {
        this.stepsToRun = typeof count === 'number' ? count : Infinity;
        this.dispatchEvent(new events_1.EnginePlayEvent());
    };
    Engine.prototype.isPlaying = function () {
        return this.stepsToRun > 0;
    };
    Engine.prototype.getRemainingStepsToRun = function () {
        return this.stepsToRun;
    };
    Engine.prototype.reset = function () {
        this.circ.getShapes().forEach(function (shape) { return shape.reset(); });
        this.runResetCallbacks();
        this.totalStepsRun = 0;
        // Run a single step to correctly position and render the shapes
        this.step();
    };
    Engine.prototype.stepFast = function (count) {
        var thenContinue = this.getRemainingStepsToRun();
        this.pause();
        for (var step = 0; step < count; step++) {
            this.step();
        }
        this.play(thenContinue);
    };
    Engine.prototype.calculateShapes = function () {
        var _this = this;
        var parentShape = null;
        this.circ.getShapes().forEach(function (shape) {
            shape.calculatePosition(parentShape);
            if (shape.stepMod === 0 || _this.totalStepsRun % shape.stepMod === 0) {
                shape.calculateAngle();
            }
            parentShape = shape;
        });
    };
    Engine.prototype.step = function () {
        this.totalStepsRun++;
        this.calculateShapes();
        this.runStepCallbacks();
    };
    Engine.prototype.runStepCallbacks = function () {
        var _this = this;
        this.stepCallbacks.forEach(function (callable) {
            callable(_this.circ);
        });
    };
    Engine.prototype.runResetCallbacks = function () {
        this.resetCallbacks.forEach(function (callable) {
            callable();
        });
    };
    Engine.prototype.runImportCallbacks = function () {
        var _this = this;
        this.importCallbacks.forEach(function (callable) {
            callable(_this.circ);
        });
    };
    Engine.prototype.run = function () {
        var _this = this;
        setTimeout(function (_) {
            if (_this.stepsToRun > 0) {
                _this.step();
                _this.stepsToRun--;
            }
            _this.run();
        }, this.interval);
    };
    Engine.prototype.getStepInterval = function () {
        return this.interval;
    };
    Engine.prototype.setStepInterval = function (milliseconds) {
        this.interval = milliseconds;
    };
    return Engine;
}(structure_1.EventEmitter));
exports.Engine = Engine;
var EngineProxyHandler = {
    set: function (target, propertyName, value, receiver) {
        target[propertyName] = value;
        target.dispatchEvent(new events_1.AttributeChangedEvent(propertyName.toString(), value));
        return true;
    },
};
var EngineFactory = function () { return new Proxy(new Engine(), EngineProxyHandler); };
exports.EngineFactory = EngineFactory;
