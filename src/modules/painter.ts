import {CircInterface, CircleInterface, CirclePainterInterface} from "../structure";

export default class Painter implements CirclePainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    
    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }
    
    clear(): void {
    }

    draw(circ: CircInterface): void {
        circ.shapes[0].state.centre.x = (circ.width/2);
        circ.shapes[0].state.centre.y = (circ.height/2);

        circ.shapes.forEach((circle:CircleInterface) => {
            if (circle.brushes.length === 0) {
                return;
            }
            
            this.drawPoints(circle);
        })
    }

    exportImageAsDataURL(): string {
        return "";
    }

    drawPoints (circle: CircleInterface) {

        circle.brushes.forEach(brush => {
            const radians = circle.state.getAngle();
            const x = circle.state.drawPoint.x + (Math.cos(radians + (brush.degrees * (Math.PI/180))) * brush.offset);
            const y = circle.state.drawPoint.y + (Math.sin(radians + (brush.degrees * (Math.PI/180))) * brush.offset);
            const color = brush.color;

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
