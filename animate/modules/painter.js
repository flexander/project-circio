"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Painter = /** @class */ (function () {
    function Painter(canvasContext) {
        this.canvasContext = canvasContext;
    }
    Painter.prototype.clear = function () {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    Painter.prototype.draw = function (circ) {
        var _this = this;
        this.centerCanvas();
        circ.getShapes().forEach(function (circle) {
            if (circle.getBrushes().length === 0) {
                return;
            }
            _this.drawPoints(circle);
        });
    };
    Painter.prototype.centerCanvas = function () {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.translate((this.canvasContext.canvas.width / 2), (this.canvasContext.canvas.height / 2));
    };
    Painter.prototype.exportImageAsDataURL = function () {
        return "";
    };
    Painter.prototype.drawPoints = function (circle) {
        var _this = this;
        circle.getBrushes().forEach(function (brush) {
            var radians = circle.state.getAngle();
            var x = circle.state.drawPoint.x + (Math.cos(radians + (brush.degrees * (Math.PI / 180))) * brush.offset);
            var y = circle.state.drawPoint.y + (Math.sin(radians + (brush.degrees * (Math.PI / 180))) * brush.offset);
            var color = brush.colorWithAlpha;
            if (brush.link === true) {
                var previousX = circle.state.previousState.drawPoint.x + (Math.cos(radians + (brush.degrees * (Math.PI / 180))) * brush.offset);
                var previousY = circle.state.previousState.drawPoint.y + (Math.sin(radians + (brush.degrees * (Math.PI / 180))) * brush.offset);
                _this.canvasContext.strokeStyle = color;
                _this.canvasContext.beginPath();
                _this.canvasContext.moveTo(previousX, previousY);
                _this.canvasContext.lineTo(x, y);
                _this.canvasContext.lineWidth = brush.point;
                _this.canvasContext.stroke();
            }
            else {
                _this.canvasContext.fillStyle = color;
                _this.canvasContext.beginPath();
                _this.canvasContext.arc(x, y, brush.point, 0, 2 * Math.PI);
                _this.canvasContext.fill();
            }
        });
    };
    ;
    return Painter;
}());
exports.default = Painter;
