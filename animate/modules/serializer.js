"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circ_1 = require("./circ");
var brushes_1 = require("./brushes");
var circle_1 = require("./circle");
var Serializer = /** @class */ (function () {
    function Serializer() {
        this.classes = {
            Circ: circ_1.default,
            Circle: circle_1.CircleFactory,
            CircleCenterPosition: circle_1.CircleCenterPosition,
            CircleDrawPosition: circle_1.CircleDrawPosition,
            CircleState: circle_1.CircleState,
            Brush: brushes_1.default,
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
