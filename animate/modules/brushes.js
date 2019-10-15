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
var cloneDeep = require('lodash.clonedeep');
var Brush = /** @class */ (function (_super) {
    __extends(Brush, _super);
    function Brush() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.config = cloneDeep(new BrushConfigDefault());
        return _this;
    }
    Object.defineProperty(Brush.prototype, "color", {
        get: function () {
            return this.config.color;
        },
        set: function (color) {
            this.config.color = color;
            this.dispatchEvent(new events_1.AttributeChangedEvent('color', this.color));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "transparency", {
        get: function () {
            return this.config.transparency;
        },
        set: function (transparency) {
            this.config.transparency = transparency;
            this.dispatchEvent(new events_1.AttributeChangedEvent('transparency', this.transparency));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "degrees", {
        get: function () {
            return this.config.degrees;
        },
        set: function (degrees) {
            this.config.degrees = degrees;
            this.dispatchEvent(new events_1.AttributeChangedEvent('degrees', this.degrees));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "draw", {
        get: function () {
            return this.config.draw;
        },
        set: function (draw) {
            this.config.draw = draw;
            this.dispatchEvent(new events_1.AttributeChangedEvent('draw', this.draw));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "link", {
        get: function () {
            return this.config.link;
        },
        set: function (link) {
            this.config.link = link;
            this.dispatchEvent(new events_1.AttributeChangedEvent('link', this.link));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "offset", {
        get: function () {
            return this.config.offset;
        },
        set: function (offset) {
            this.config.offset = offset;
            this.dispatchEvent(new events_1.AttributeChangedEvent('offset', this.offset));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "point", {
        get: function () {
            return this.config.point;
        },
        set: function (point) {
            this.config.point = point;
            this.dispatchEvent(new events_1.AttributeChangedEvent('point', this.point));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "colorWithAlpha", {
        get: function () {
            return this.config.colorWithAlpha;
        },
        enumerable: true,
        configurable: true
    });
    return Brush;
}(structure_1.EventEmitter));
exports.Brush = Brush;
var BrushConfigDefault = /** @class */ (function () {
    function BrushConfigDefault() {
        var _newTarget = this.constructor;
        this.color = '#FFFFFF';
        this.degrees = 0;
        this.draw = true;
        this.link = false;
        this.offset = 0;
        this.point = 0.5;
        this.transparency = 0;
        if (_newTarget === BrushConfigDefault) {
            Object.freeze(this);
        }
    }
    Object.defineProperty(BrushConfigDefault.prototype, "colorWithAlpha", {
        get: function () {
            return this.color + ('00' + (255 - this.transparency).toString(16)).substr(-2);
        },
        enumerable: true,
        configurable: true
    });
    return BrushConfigDefault;
}());
exports.BrushConfigDefault = BrushConfigDefault;
var BrushConfig = /** @class */ (function (_super) {
    __extends(BrushConfig, _super);
    function BrushConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BrushConfig;
}(BrushConfigDefault));
exports.BrushConfig = BrushConfig;
