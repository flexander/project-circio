import {BackgroundPainterInterface, CircInterface} from "../structure";

export default class BackgroundPainter implements BackgroundPainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    
    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }

    public draw(circ: CircInterface): void {
        this.canvasContext.fillStyle = circ.backgroundFill;
        this.canvasContext.fillRect(0, 0, circ.width, circ.height);
    }

    clear(): void {
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    exportImageAsDataURL(): string {
        return "";
    }
}
