import {CircInterface, CircStateInterface, ShapeInterface} from "../structure";

export default class Circ implements CircInterface {
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
    }

    getShapes(): ShapeInterface[] {
        return this.shapes;
    }
}
