import {
    BrushInterface,
    CircInterface,
    CircleInterface,
    GuidePainterInterface,
    PolygonInterface,
    PositionInterface,
    ShapeInterface
} from "../structure";
import {Circle} from "./circle";
import {Polygon} from "./polygon";

export default class GuidePainter implements GuidePainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    protected visible: boolean = true;
    protected guideColor = '#FFF';
    
    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }

    public hide(): void {
        this.visible = false;
        this.canvasContext.canvas.style.visibility = 'hidden';
    }

    public show(): void {
        this.visible = true;
        this.canvasContext.canvas.style.visibility = 'visible';
    }

    public isVisible(): boolean {
        return this.visible === true;
    }

    public clear(): void {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width/2, -this.canvasContext.canvas.height/2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    protected centerCanvas() {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.translate((this.canvasContext.canvas.width/2), (this.canvasContext.canvas.height/2));
    }

    public draw(circ: CircInterface): void {
        this.centerCanvas();
        this.clear();
        this.guideColor = '#'+this.generateContrastingColor(circ.backgroundFill);

        circ.getShapes().forEach((shape: ShapeInterface) => {
            if (shape instanceof Circle) {
                this.drawCircle(shape);
            } else if (shape instanceof Polygon) {
                this.drawPolygon(shape);
            }
        })
    }

    protected generateContrastingColor(color: string): string
    {
        color = color.replace('#','');

        return (this.calculateLuma(color) >= 165) ? '000' : 'fff';
    }

    protected calculateLuma(color: string): number
    {
        if (color.length === 3) {
            color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
        } else if (color.length !== 6) {
            throw('Invalid hex color: ' + color);
        }

        const rgb = [];
        for (let i = 0; i <= 2; i++) {
            rgb[i] = parseInt(color.substr(i * 2, 2), 16);
        }

        return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
    }

    public exportImageAsDataURL(): string {
        return "";
    }


    protected drawCircle (circle: CircleInterface): void {

        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.centre.x,circle.state.centre.y,circle.radius,0,2*Math.PI);
        this.canvasContext.stroke();

        this.drawRotationIndicator(circle);
        circle.getBrushes().forEach((brush: BrushInterface) => this.drawBrushPoint(circle, brush));
    }

    protected drawPolygon (polygon: PolygonInterface): void {

        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.beginPath();

        this.canvasContext.moveTo (polygon.state.centre.x + polygon.getRadius() * Math.cos(polygon.state.getAngle()), polygon.state.centre.y +  polygon.getRadius() * Math.sin(polygon.state.getAngle()));

        for (let i = 1; i <= polygon.faces;i += 1) {
            this.canvasContext.lineTo (polygon.state.centre.x + polygon.getRadius() * Math.cos((polygon.state.getAngle()) + (i * 2 * Math.PI / polygon.faces)), polygon.state.centre.y + polygon.getRadius() * Math.sin((polygon.state.getAngle()) + (i * 2 * Math.PI / polygon.faces)));
        }

        this.canvasContext.stroke();

        this.drawPoint(polygon.state.contactPoint);
        this.drawPoint(polygon.state.centre);
        this.drawPoint(polygon.state.drawPoint, '#33ff11');

        this.drawPointToPoint(polygon.state.centre, polygon.state.contactPoint);
        if(typeof polygon.parent !== "undefined") {
            this.drawPointToPoint(polygon.parent.state.centre, polygon.state.contactPoint);
            this.drawPointToPoint(polygon.parent.state.centre, polygon.state.centre);
        }
    }

    protected drawPoint (point: PositionInterface, colour?: string): void {
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = colour? colour: this.guideColor;
        this.canvasContext.arc(point.x, point.y, Math.max(4), 0, 2*Math.PI);
        this.canvasContext.fill();
    }

    protected drawPointToPoint(pointA: PositionInterface, pointB: PositionInterface): void {
        this.canvasContext.moveTo (pointA.x, pointA.y);
        this.canvasContext.lineTo (pointB.x, pointB.y);
        this.canvasContext.stroke();
    }

    protected drawRotationIndicator (circle: CircleInterface): void {
        this.canvasContext.fillStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.drawPoint.x, circle.state.drawPoint.y, 4, 0, 2*Math.PI);
        this.canvasContext.fill();
    }

    protected drawBrushPoint(circle: CircleInterface, brush: BrushInterface): void {
        const brushPointX = circle.state.drawPoint.x + (Math.cos(circle.state.getAngle() + (brush.degrees * (Math.PI/180))) * brush.offset);
        const brushPointY = circle.state.drawPoint.y + (Math.sin(circle.state.getAngle() + (brush.degrees * (Math.PI/180))) * brush.offset);

        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.moveTo(circle.state.drawPoint.x, circle.state.drawPoint.y);
        this.canvasContext.lineTo(brushPointX, brushPointY);
        this.canvasContext.stroke();

        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = brush.colorWithAlpha;
        this.canvasContext.arc(brushPointX, brushPointY, Math.max(2,brush.point), 0, 2*Math.PI);
        this.canvasContext.fill();
    }

}
