"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = require("./circle");
var circ_1 = require("./circ");
var brushes_1 = require("./brushes");
var Serializer = /** @class */ (function () {
    function Serializer() {
        this.classes = {
            Circ: circ_1.Circ,
            CircConfig: circ_1.CircConfig,
            Circle: circle_1.Circle,
            CircleCenterPosition: circle_1.CircleCenterPosition,
            CircleDrawPosition: circle_1.CircleDrawPosition,
            CircleState: circle_1.CircleState,
            CircleConfig: circle_1.CircleConfig,
            Brush: brushes_1.Brush,
            BrushConfig: brushes_1.BrushConfig,
        };
    }
    Serializer.prototype.serialize = function (circ) {
        return JSON.stringify(circ, this.replace.bind(this));
    };
    Serializer.prototype.unserialize = function (circJson) {
        return JSON.parse(circJson, this.revive.bind(this));
    };
    Serializer.prototype.replace = function (key, value) {
        if (key === 'events') {
            return;
        }
        if (value instanceof Object) {
            value.__type = value.constructor.name;
        }
        return value;
    };
    Serializer.prototype.revive = function (key, value) {
        if (value instanceof Object === false || typeof value.__type !== 'string') {
            return value;
        }
        var p = this.makeClass(value.__type);
        Object.getOwnPropertyNames(value).forEach(function (k) {
            p[k] = value[k];
        });
        delete p.__type;
        return p;
    };
    Serializer.prototype.makeClass = function (className) {
        if (typeof this.classes[className] === 'undefined') {
            throw "Unknown class " + className;
        }
        return new this.classes[className]();
    };
    return Serializer;
}());
exports.default = Serializer;
