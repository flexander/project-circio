"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundPainter = /** @class */ (function () {
    function BackgroundPainter(canvasContext) {
        this.canvasCenter = new CanvasCenter();
        this.canvasContext = canvasContext;
    }
    BackgroundPainter.prototype.draw = function (circ) {
        this.centerCanvas(circ);
        this.canvasContext.fillStyle = circ.backgroundFill;
        this.canvasContext.fillRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    BackgroundPainter.prototype.centerCanvas = function (circ) {
        if (this.canvasCenter.x !== (circ.width / 2)) {
            this.canvasContext.translate(-this.canvasCenter.x, 0);
            this.canvasContext.translate((circ.width / 2), 0);
            this.canvasCenter.x = (circ.width / 2);
        }
        if (this.canvasCenter.y !== (circ.height / 2)) {
            this.canvasContext.translate(0, -this.canvasCenter.y);
            this.canvasContext.translate(0, (circ.height / 2));
            this.canvasCenter.y = (circ.height / 2);
        }
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
var CanvasCenter = /** @class */ (function () {
    function CanvasCenter() {
        this.x = 0;
        this.y = 0;
    }
    return CanvasCenter;
}());
