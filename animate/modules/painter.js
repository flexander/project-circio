"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Painter = /** @class */ (function () {
    function Painter(canvasContext) {
        this.canvasCenter = new CanvasCenter();
        this.canvasContext = canvasContext;
    }
    Painter.prototype.clear = function () {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    Painter.prototype.draw = function (circ) {
        var _this = this;
        this.centerCanvas(circ);
        circ.getShapes().forEach(function (circle) {
            if (circle.brushes.length === 0) {
                return;
            }
            _this.drawPoints(circle);
        });
    };
    Painter.prototype.centerCanvas = function (circ) {
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
    Painter.prototype.exportImageAsDataURL = function () {
        return "";
    };
    Painter.prototype.drawPoints = function (circle) {
        var _this = this;
        circle.brushes.forEach(function (brush) {
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
var CanvasCenter = /** @class */ (function () {
    function CanvasCenter() {
        this.x = 0;
        this.y = 0;
    }
    return CanvasCenter;
}());
