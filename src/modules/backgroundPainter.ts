import {BackgroundPainterInterface, CircInterface, PositionInterface} from "../structure";

export default class BackgroundPainter implements BackgroundPainterInterface {
    protected canvasContext: CanvasRenderingContext2D;
    protected canvasCenter: PositionInterface = new CanvasCenter();
    
    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }

    public draw(circ: CircInterface): void {
        this.centerCanvas(circ);

        this.canvasContext.fillStyle = circ.backgroundFill;
        this.canvasContext.fillRect(-this.canvasContext.canvas.width/2, -this.canvasContext.canvas.height/2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
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

    clear(): void {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width/2, -this.canvasContext.canvas.height/2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    exportImageAsDataURL(): string {
        return "";
    }
}

class CanvasCenter implements PositionInterface {
    x: number = 0;
    y: number = 0;
}
