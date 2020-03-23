import {BackgroundPainterInterface, CircInterface} from "../structure";

export default class BackgroundPainter implements BackgroundPainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    
    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }

    public draw(circ: CircInterface): void {
        this.centerCanvas();

        this.canvasContext.fillStyle = circ.backgroundFill;
        this.canvasContext.fillRect(-this.canvasContext.canvas.width/2, -this.canvasContext.canvas.height/2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    protected centerCanvas() {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.translate((this.canvasContext.canvas.width/2), (this.canvasContext.canvas.height/2));
    }

    clear(): void {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width/2, -this.canvasContext.canvas.height/2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    exportImageAsDataURL(): string {
        return "";
    }
}
