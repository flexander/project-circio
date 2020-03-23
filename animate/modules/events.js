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
