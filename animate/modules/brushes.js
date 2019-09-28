"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Brush = /** @class */ (function () {
    function Brush() {
        this.hexcolor = '#FFFFFF';
        this.transparency = 0;
        this.degrees = 0;
        this.draw = true;
        this.link = false;
        this.offset = 0;
        this.point = 0.5;
    }
    Object.defineProperty(Brush.prototype, "color", {
        get: function () {
            return this.hexcolor + ('00' + (255 - this.transparency).toString(16)).substr(-2);
        },
        set: function (value) {
            this.hexcolor = value;
        },
        enumerable: true,
        configurable: true
    });
    return Brush;
}());
exports.default = Brush;
