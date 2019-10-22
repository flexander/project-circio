"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = require("./circle");
var polygon_1 = require("./polygon");
var GuidePainter = /** @class */ (function () {
    function GuidePainter(canvasContext) {
        this.visible = true;
        this.guideColor = '#FFF';
        this.canvasContext = canvasContext;
    }
    GuidePainter.prototype.hide = function () {
        this.visible = false;
        this.canvasContext.canvas.style.visibility = 'hidden';
    };
    GuidePainter.prototype.show = function () {
        this.visible = true;
        this.canvasContext.canvas.style.visibility = 'visible';
    };
    GuidePainter.prototype.isVisible = function () {
        return this.visible === true;
    };
    GuidePainter.prototype.clear = function () {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    GuidePainter.prototype.centerCanvas = function () {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.translate((this.canvasContext.canvas.width / 2), (this.canvasContext.canvas.height / 2));
    };
    GuidePainter.prototype.draw = function (circ) {
        var _this = this;
        this.centerCanvas();
        this.clear();
        this.guideColor = '#' + this.generateContrastingColor(circ.backgroundFill);
        circ.getShapes().forEach(function (shape) {
            if (shape instanceof circle_1.Circle) {
                _this.drawCircle(shape);
            }
            else if (shape instanceof polygon_1.Polygon) {
                _this.drawPolygon(shape);
            }
        });
    };
    GuidePainter.prototype.generateContrastingColor = function (color) {
        color = color.replace('#', '');
        return (this.calculateLuma(color) >= 165) ? '000' : 'fff';
    };
    GuidePainter.prototype.calculateLuma = function (color) {
        if (color.length === 3) {
            color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
        }
        else if (color.length !== 6) {
            throw ('Invalid hex color: ' + color);
        }
        var rgb = [];
        for (var i = 0; i <= 2; i++) {
            rgb[i] = parseInt(color.substr(i * 2, 2), 16);
        }
        return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
    };
    GuidePainter.prototype.exportImageAsDataURL = function () {
        return "";
    };
    GuidePainter.prototype.drawCircle = function (circle) {
        var _this = this;
        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.centre.x, circle.state.centre.y, circle.radius, 0, 2 * Math.PI);
        this.canvasContext.stroke();
        this.drawRotationIndicator(circle);
        circle.getBrushes().forEach(function (brush) { return _this.drawBrushPoint(circle, brush); });
    };
    GuidePainter.prototype.drawPolygon = function (polygon) {
        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(polygon.state.centre.x + polygon.getRadius() * Math.cos(polygon.state.totalAngle), polygon.state.centre.y + polygon.getRadius() * Math.sin(polygon.state.totalAngle));
        for (var i = 1; i <= polygon.faces; i += 1) {
            this.canvasContext.lineTo(polygon.state.centre.x + polygon.getRadius() * Math.cos((polygon.state.totalAngle) + (i * 2 * Math.PI / polygon.faces)), polygon.state.centre.y + polygon.getRadius() * Math.sin((polygon.state.totalAngle) + (i * 2 * Math.PI / polygon.faces)));
        }
        this.canvasContext.stroke();
        this.drawPoint(polygon.state.contactPoint);
        this.drawPoint(polygon.state.centre);
        this.drawPoint(polygon.state.drawPoint, '#33ff11');
        this.drawPointToPoint(polygon.state.centre, polygon.state.contactPoint);
        if (typeof polygon.parent !== "undefined") {
            this.drawPointToPoint(polygon.parent.state.centre, polygon.state.contactPoint);
            this.drawPointToPoint(polygon.parent.state.centre, polygon.state.centre);
        }
    };
    GuidePainter.prototype.drawPoint = function (point, colour) {
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = colour ? colour : this.guideColor;
        this.canvasContext.arc(point.x, point.y, Math.max(4), 0, 2 * Math.PI);
        this.canvasContext.fill();
    };
    GuidePainter.prototype.drawPointToPoint = function (pointA, pointB) {
        this.canvasContext.moveTo(pointA.x, pointA.y);
        this.canvasContext.lineTo(pointB.x, pointB.y);
        this.canvasContext.stroke();
    };
    GuidePainter.prototype.drawRotationIndicator = function (circle) {
        this.canvasContext.fillStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.drawPoint.x, circle.state.drawPoint.y, 4, 0, 2 * Math.PI);
        this.canvasContext.fill();
    };
    GuidePainter.prototype.drawBrushPoint = function (circle, brush) {
        var brushPointX = circle.state.drawPoint.x + (Math.cos(circle.state.getAngle() + (brush.degrees * (Math.PI / 180))) * brush.offset);
        var brushPointY = circle.state.drawPoint.y + (Math.sin(circle.state.getAngle() + (brush.degrees * (Math.PI / 180))) * brush.offset);
        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.moveTo(circle.state.drawPoint.x, circle.state.drawPoint.y);
        this.canvasContext.lineTo(brushPointX, brushPointY);
        this.canvasContext.stroke();
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = brush.colorWithAlpha;
        this.canvasContext.arc(brushPointX, brushPointY, Math.max(2, brush.point), 0, 2 * Math.PI);
        this.canvasContext.fill();
    };
    return GuidePainter;
}());
exports.default = GuidePainter;
