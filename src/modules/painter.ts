import {BrushInterface, CircInterface, CircleInterface, CirclePainterInterface, PositionInterface} from "../structure";

export default class Painter implements CirclePainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    
    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }
    
    clear(): void {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width/2, -this.canvasContext.canvas.height/2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    draw(circ: CircInterface): void {
        this.centerCanvas(circ);

        circ.getShapes().forEach((circle:CircleInterface) => {
            if (circle.getBrushes().length === 0) {
                return;
            }
            
            this.drawPoints(circle);
        })
    }

    protected centerCanvas(circ: CircInterface) {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.translate((circ.width/2), (circ.height/2));
    }

    exportImageAsDataURL(): string {
        return "";
    }

    drawPoints (circle: CircleInterface) {

        circle.getBrushes().forEach((brush: BrushInterface) => {
            const radians = circle.state.getAngle();
            const x = circle.state.drawPoint.x + (Math.cos(radians + (brush.degrees * (Math.PI/180))) * brush.offset);
            const y = circle.state.drawPoint.y + (Math.sin(radians + (brush.degrees * (Math.PI/180))) * brush.offset);
            const color = brush.colorWithAlpha;

            if(brush.link === true) {
                const previousX = circle.state.previousState.drawPoint.x + (Math.cos(radians + (brush.degrees * (Math.PI/180))) * brush.offset);
                const previousY = circle.state.previousState.drawPoint.y + (Math.sin(radians + (brush.degrees * (Math.PI/180))) * brush.offset);
                this.canvasContext.strokeStyle = color;
                this.canvasContext.beginPath();
                this.canvasContext.moveTo(previousX, previousY);
                this.canvasContext.lineTo(x, y);
                this.canvasContext.lineWidth = brush.point;
                this.canvasContext.stroke();
            } else {
                this.canvasContext.fillStyle = color;
                this.canvasContext.beginPath();
                this.canvasContext.arc(x, y, brush.point, 0, 2*Math.PI);
                this.canvasContext.fill();
            }
        });
    };

}
