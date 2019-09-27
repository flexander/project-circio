"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AttributeChangedEvent = /** @class */ (function () {
    function AttributeChangedEvent(name, value) {
        this.name = name;
        this.value = value;
    }
    AttributeChangedEvent.prototype.getName = function () {
        return "change." + this.name;
    };
    AttributeChangedEvent.prototype.getContext = function () {
        return [this.value, this.name];
    };
    return AttributeChangedEvent;
}());
exports.AttributeChangedEvent = AttributeChangedEvent;
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
var ShapeAddEvent = /** @class */ (function () {
    function ShapeAddEvent(shape) {
        this.shape = shape;
    }
    ShapeAddEvent.prototype.getName = function () {
        return "shape.add";
    };
    ShapeAddEvent.prototype.getContext = function () {
        return [this.shape];
    };
    return ShapeAddEvent;
}());
exports.ShapeAddEvent = ShapeAddEvent;
var ShapeDeleteEvent = /** @class */ (function () {
    function ShapeDeleteEvent(shape) {
        this.shape = shape;
    }
    ShapeDeleteEvent.prototype.getName = function () {
        return "shape.delete";
    };
    ShapeDeleteEvent.prototype.getContext = function () {
        return [this.shape];
    };
    return ShapeDeleteEvent;
}());
exports.ShapeDeleteEvent = ShapeDeleteEvent;
