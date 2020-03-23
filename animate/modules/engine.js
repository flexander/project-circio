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
        _this.state = new EngineState();
        _this.config = new EngineConfig();
        _this.stepCallbacks = [];
        _this.resetCallbacks = [];
        _this.importCallbacks = [];
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
        this.stopStepJumping();
    };
    Engine.prototype.play = function (count) {
        this.stepsToRun = typeof count === 'number' ? count : Infinity;
    };
    Engine.prototype.isPlaying = function () {
        return this.stepsToRun > 0 || this.state.stepJumps.length > 0;
    };
    Engine.prototype.reset = function () {
        this.stopStepJumping();
        if (typeof this.circ !== "undefined") {
            this.circ.getShapes().forEach(function (shape) { return shape.reset(); });
        }
        this.runResetCallbacks();
        this.state.totalStepsRun = 0;
        // Run a single step to correctly position and render the shapes
        this.step();
    };
    Engine.prototype.stopStepJumping = function () {
        if (this.state.stepJumps.length === 0) {
            return;
        }
        this.state.stepJumpTimers.forEach(function (timeId) {
            clearTimeout(timeId);
        });
        this.state.stepJumpTimers = [];
        this.state.stepJumps = [];
        this.dispatchEvent(new EngineStepJumpEnd());
    };
    Engine.prototype.stepFast = function (count) {
        var _this = this;
        if (this.state.stepJumps.length > 0) {
            throw "Step jump in progress";
        }
        var thenContinue = this.stepsToRun;
        this.pause();
        var stepGroup = 100;
        var stepsRun = 0;
        while (stepsRun < count) {
            var stepsLeftToRun = count - stepsRun;
            var stepsToRun = (stepsLeftToRun < stepGroup) ? stepsLeftToRun : stepGroup;
            this.state.stepJumps.push(this.stepJump(stepsToRun));
            stepsRun += stepsToRun;
        }
        this.dispatchEvent(new EngineStepJumpStart());
        return Promise.all(this.state.stepJumps)
            .then(function (_) {
            _this.dispatchEvent(new EngineStepJumpEnd());
            _this.play(thenContinue);
            _this.state.stepJumps = [];
        });
    };
    Engine.prototype.stepJump = function (number) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var id = setTimeout(function (_) {
                for (var step = 0; step < number; step++) {
                    _this.step();
                }
                resolve();
            }, 0);
            _this.state.stepJumpTimers.push(id);
        });
    };
    Engine.prototype.calculateShapes = function () {
        var _this = this;
        if (typeof this.circ === "undefined") {
            return;
        }
        var parentShape = null;
        this.circ.getShapes().forEach(function (shape) {
            shape.calculatePosition(parentShape);
            if (shape.stepMod === 0 || _this.state.totalStepsRun % shape.stepMod === 0) {
                shape.calculateAngle();
            }
            parentShape = shape;
        });
    };
    Engine.prototype.step = function () {
        this.state.totalStepsRun++;
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
        }, this.stepInterval);
    };
    Object.defineProperty(Engine.prototype, "stepInterval", {
        get: function () {
            return this.config.stepInterval;
        },
        set: function (milliseconds) {
            this.config.stepInterval = milliseconds;
            this.dispatchEvent(new events_1.AttributeChangedEvent('stepInterval', this.stepInterval));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "stepsToRun", {
        get: function () {
            return this.config.stepsToRun;
        },
        set: function (steps) {
            var stepsChangedBy = Math.abs(this.config.stepsToRun - steps);
            this.config.stepsToRun = steps;
            this.dispatchEvent(new events_1.AttributeChangedEvent('stepsToRun', this.stepsToRun));
            if (stepsChangedBy !== 0) {
                if (steps > 0) {
                    this.dispatchEvent(new EnginePlayEvent());
                }
                else if (steps === 0) {
                    this.dispatchEvent(new EnginePauseEvent());
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return Engine;
}(structure_1.EventEmitter));
exports.Engine = Engine;
var EngineConfigDefault = /** @class */ (function () {
    function EngineConfigDefault() {
        var _newTarget = this.constructor;
        this.stepInterval = 1;
        this.stepsToRun = 0;
        if (_newTarget === EngineConfigDefault) {
            Object.freeze(this);
        }
    }
    return EngineConfigDefault;
}());
exports.EngineConfigDefault = EngineConfigDefault;
var EngineConfig = /** @class */ (function (_super) {
    __extends(EngineConfig, _super);
    function EngineConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EngineConfig;
}(EngineConfigDefault));
exports.EngineConfig = EngineConfig;
var EngineState = /** @class */ (function () {
    function EngineState() {
        this.totalStepsRun = 0;
        this.stepJumps = [];
        this.stepJumpTimers = [];
    }
    return EngineState;
}());
var EnginePauseEvent = /** @class */ (function () {
    function EnginePauseEvent() {
    }
    EnginePauseEvent.prototype.getName = function () {
        return "pause";
    };
    EnginePauseEvent.prototype.getContext = function () {
        return [];
    };
    return EnginePauseEvent;
}());
exports.EnginePauseEvent = EnginePauseEvent;
var EnginePlayEvent = /** @class */ (function () {
    function EnginePlayEvent() {
    }
    EnginePlayEvent.prototype.getName = function () {
        return "play";
    };
    EnginePlayEvent.prototype.getContext = function () {
        return [];
    };
    return EnginePlayEvent;
}());
exports.EnginePlayEvent = EnginePlayEvent;
var EngineStepJumpStart = /** @class */ (function () {
    function EngineStepJumpStart() {
    }
    EngineStepJumpStart.prototype.getName = function () {
        return "stepJump.start";
    };
    EngineStepJumpStart.prototype.getContext = function () {
        return [];
    };
    return EngineStepJumpStart;
}());
exports.EngineStepJumpStart = EngineStepJumpStart;
var EngineStepJumpEnd = /** @class */ (function () {
    function EngineStepJumpEnd() {
    }
    EngineStepJumpEnd.prototype.getName = function () {
        return "stepJump.end";
    };
    EngineStepJumpEnd.prototype.getContext = function () {
        return [];
    };
    return EngineStepJumpEnd;
}());
exports.EngineStepJumpEnd = EngineStepJumpEnd;
