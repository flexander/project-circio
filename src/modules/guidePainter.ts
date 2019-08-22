import {BrushInterface, CircInterface, CircleInterface, GuidePainterInterface} from "../structure";

export default class GuidePainter implements GuidePainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    protected visible: boolean;
    
    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }

    public hide(): void {
        this.visible = false;
    }

    public show(): void {
        this.visible = true;
    }

    public clear(): void {
        this.canvasContext.clearRect(0, 0, 10000, 10000);
    }

    public draw(circ: CircInterface): void {
        this.clear();

        if (this.visible === false) {
            return;
        }

        circ.shapes.forEach((circle:CircleInterface) => {
            this.drawCircle(circle);
        })
    }

    public exportImageAsDataURL(): string {
        return "";
    }


    protected drawCircle (circle: CircleInterface): void {
        const color = '#FFF';

        this.canvasContext.strokeStyle = color;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.centre.x,circle.state.centre.y,circle.radius,0,2*Math.PI);
        this.canvasContext.stroke();

        this.drawRotationIndicator(circle);
        circle.brushes.forEach((brush: BrushInterface) => this.drawBrushPoint(circle, brush));
    }

    protected drawRotationIndicator (circle: CircleInterface): void {
        const color = '#FFF';

        this.canvasContext.fillStyle = color;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.drawPoint.x, circle.state.drawPoint.y, 4, 0, 2*Math.PI);
        this.canvasContext.fill();
    }

    protected drawBrushPoint(circle: CircleInterface, brush: BrushInterface): void {
        const color = '#FFF';
        const brushPointX = circle.state.drawPoint.x + (Math.cos(circle.state.getAngle() + (brush.degrees * (Math.PI/180))) * brush.offset);
        const brushPointY = circle.state.drawPoint.y + (Math.sin(circle.state.getAngle() + (brush.degrees * (Math.PI/180))) * brush.offset);

        this.canvasContext.strokeStyle = color;
        this.canvasContext.fillStyle = color;
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(circle.state.drawPoint.x, circle.state.drawPoint.y);
        this.canvasContext.lineTo(brushPointX, brushPointY);
        this.canvasContext.stroke();
        this.canvasContext.arc(brushPointX, brushPointY, 4, 0, 2*Math.PI);
        this.canvasContext.fill();
    }

}
