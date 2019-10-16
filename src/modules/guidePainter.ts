import {BrushInterface, CircInterface, CircleInterface, GuidePainterInterface} from "../structure";

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

        circ.getShapes().forEach((circle:CircleInterface) => {
            this.drawCircle(circle);
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