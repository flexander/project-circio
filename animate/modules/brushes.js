"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Brush = /** @class */ (function () {
    function Brush() {
        this.color = '#FFFFFF';
        this.transparency = 0;
        this.degrees = 0;
        this.draw = true;
        this.link = false;
        this.offset = 0;
        this.point = 0.5;
    }
    Object.defineProperty(Brush.prototype, "colorWithAlpha", {
        get: function () {
            return this.color + ('00' + (255 - this.transparency).toString(16)).substr(-2);
        },
        enumerable: true,
        configurable: true
    });
    return Brush;
}());
exports.default = Brush;
