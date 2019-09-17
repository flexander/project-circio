import {
    BrushInterface,
    CircInterface,
    CircleInterface,
    GuidePainterInterface,
    PositionInterface,
    ShapeInterface
} from "../structure";
import {Circle} from "./circle";

export default class GuidePainter implements GuidePainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    protected canvasCenter: PositionInterface = new CanvasCenter();
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

    protected centerCanvas(circ: CircInterface) {
        if (this.canvasCenter.x !== (circ.width/2)) {
            this.canvasContext.translate(-this.canvasCenter.x, 0);
            this.canvasContext.translate((circ.width/2), 0);
            this.canvasCenter.x = (circ.width/2);
        }
        if (this.canvasCenter.y !== (circ.height/2)) {
            this.canvasContext.translate(0,-this.canvasCenter.y);
            this.canvasContext.translate(0,(circ.height/2));
            this.canvasCenter.y = (circ.height/2);
        }
    }

    public draw(circ: CircInterface): void {
        this.centerCanvas(circ);
        this.clear();
        this.guideColor = '#'+this.generateContrastingColor(circ.backgroundFill);

        circ.getShapes().forEach((shape: ShapeInterface) => {
            if (shape.faces === Infinity) {
                this.drawCircle(shape);
            } else {
                this.drawPolygon(shape);
                let a = this.guideColor;
                this.guideColor = '#DDD';
                this.drawCircle(shape);
                this.guideColor = a;
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

    protected drawPolygon (shape: ShapeInterface): void {
        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.beginPath();

        this.canvasContext.moveTo (shape.state.centre.x +  shape.radius * Math.cos(shape.state.totalAngle), shape.state.centre.y +  shape.radius *  Math.sin(shape.state.totalAngle));

        for (let i = 1; i <= shape.faces; i += 1) {
            const yAngle = Math.sin(i * 2 * Math.PI / shape.faces + shape.state.totalAngle);
            const xAngle = Math.cos(i * 2 * Math.PI / shape.faces + shape.state.totalAngle);

            this.canvasContext.lineTo (shape.state.centre.x + shape.radius * xAngle, shape.state.centre.y + shape.radius * yAngle);
        }

        this.canvasContext.stroke();

        this.drawRotationIndicator(shape);
        shape.brushes.forEach((brush: BrushInterface) => this.drawBrushPoint(shape, brush));
    }


    protected drawCircle (circle: CircleInterface): void {

        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.centre.x,circle.state.centre.y,circle.radius,0,2*Math.PI);
        this.canvasContext.stroke();

        this.drawRotationIndicator(circle);
        circle.brushes.forEach((brush: BrushInterface) => this.drawBrushPoint(circle, brush));
    }

    protected drawRotationIndicator (shape: ShapeInterface): void {
        this.canvasContext.fillStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(shape.state.drawPoint.x, shape.state.drawPoint.y, 4, 0, 2*Math.PI);
        this.canvasContext.fill();
    }

    protected drawBrushPoint(shape: ShapeInterface, brush: BrushInterface): void {
        const brushPointX = shape.state.drawPoint.x + (Math.cos(shape.state.getAngle() + (brush.degrees * (Math.PI/180))) * brush.offset);
        const brushPointY = shape.state.drawPoint.y + (Math.sin(shape.state.getAngle() + (brush.degrees * (Math.PI/180))) * brush.offset);

        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.moveTo(shape.state.drawPoint.x, shape.state.drawPoint.y);
        this.canvasContext.lineTo(brushPointX, brushPointY);
        this.canvasContext.stroke();

        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = brush.color;
        this.canvasContext.arc(brushPointX, brushPointY, 4, 0, 2*Math.PI);
        this.canvasContext.fill();
    }

}

class CanvasCenter implements PositionInterface {
    x: number = 0;
    y: number = 0;
}
