import {BrushInterface, CircInterface, CircleInterface, GuidePainterInterface, PositionInterface} from "../structure";

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
    }

    public show(): void {
        this.visible = true;
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

        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.centre.x,circle.state.centre.y,circle.radius,0,2*Math.PI);
        this.canvasContext.stroke();

        this.drawRotationIndicator(circle);
        circle.brushes.forEach((brush: BrushInterface) => this.drawBrushPoint(circle, brush));
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
        this.canvasContext.fillStyle = brush.color;
        this.canvasContext.arc(brushPointX, brushPointY, 4, 0, 2*Math.PI);
        this.canvasContext.fill();
    }

}

class CanvasCenter implements PositionInterface {
    x: number = 0;
    y: number = 0;
}
