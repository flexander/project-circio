"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundPainter = /** @class */ (function () {
    function BackgroundPainter(canvasContext) {
        this.canvasContext = canvasContext;
    }
    BackgroundPainter.prototype.draw = function (circ) {
        this.centerCanvas();
        this.canvasContext.fillStyle = circ.backgroundFill;
        this.canvasContext.fillRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    BackgroundPainter.prototype.centerCanvas = function () {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.translate((this.canvasContext.canvas.width / 2), (this.canvasContext.canvas.height / 2));
    };
    BackgroundPainter.prototype.clear = function () {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    BackgroundPainter.prototype.exportImageAsDataURL = function () {
        return "";
    };
    return BackgroundPainter;
}());
exports.default = BackgroundPainter;
