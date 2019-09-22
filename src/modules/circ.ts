import {CircInterface, CircStateInterface, EventEmitter, ShapeInterface} from "../structure";
import {ShapeAddEvent} from "./events";

export default class Circ extends EventEmitter implements CircInterface {
    name: string;
    height: number;
    width: number;
    backgroundFill: string;
    stepsToComplete: number;
    state: CircStateInterface;
    protected shapes: ShapeInterface[] = [];

    addShape(shape: ShapeInterface): void {
        shape.isRoot = (this.shapes.length === 0);
        this.shapes.push(shape);
        this.dispatchEvent(new ShapeAddEvent(shape))
    }

    getShapes(): ShapeInterface[] {
        return this.shapes;
    }
}
