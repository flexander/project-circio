import {CircInterface, CircleInterface, GuidePainterInterface} from "../structure";

export default class GuidePainter implements GuidePainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    protected visible: boolean;
    
    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }

    hide(): void {
        this.visible = false;
    }

    show(): void {
        this.visible = true;
    }
    
    clear(): void {
        this.canvasContext.clearRect(0, 0, 10000, 10000);
    }

    draw(circ: CircInterface): void {
        this.clear();

        if (this.visible === false) {
            return;
        }

        circ.shapes.forEach((circle:CircleInterface) => {
            this.drawCircle(circle);
        })
    }

    exportImageAsDataURL(): string {
        return "";
    }


    drawCircle (circle: CircleInterface) {
        const color = '#FFF';

        this.canvasContext.strokeStyle = color;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.centre.x,circle.state.centre.y,circle.radius,0,2*Math.PI);
        this.canvasContext.stroke();

        this.drawCircleRotation(circle);
    };

    drawCircleRotation (circle: CircleInterface) {
        const color = '#FFF';

        this.canvasContext.fillStyle = color;
        this.canvasContext.strokeStyle = color;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.drawPoint.x, circle.state.drawPoint.y, 4, 0, 2*Math.PI);
        this.canvasContext.fill();
    };

}
