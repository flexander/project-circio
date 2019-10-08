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
var Brush = /** @class */ (function (_super) {
    __extends(Brush, _super);
    function Brush() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = '#FFFFFF';
        _this.transparency = 0;
        _this.degrees = 0;
        _this.draw = true;
        _this.link = false;
        _this.offset = 0;
        _this.point = 0.5;
        return _this;
    }
    Object.defineProperty(Brush.prototype, "colorWithAlpha", {
        get: function () {
            return this.color + ('00' + (255 - this.transparency).toString(16)).substr(-2);
        },
        enumerable: true,
        configurable: true
    });
    return Brush;
}(structure_1.EventEmitter));
exports.Brush = Brush;
var BrushProxyHandler = {
    set: function (target, propertyName, value, receiver) {
        target[propertyName] = value;
        target.dispatchEvent(new events_1.AttributeChangedEvent(propertyName.toString(), value));
        return true;
    },
};
var BrushFactory = function () { return new Proxy(new Brush(), BrushProxyHandler); };
exports.BrushFactory = BrushFactory;
