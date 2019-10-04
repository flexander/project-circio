import {CircInterface, CircStateInterface, EventEmitter, ShapeInterface} from "../structure";
import {AttributeChangedEvent, ShapeAddEvent, ShapeDeleteEvent} from "./events";

class Circ extends EventEmitter implements CircInterface {
    name: string;
    height: number;
    width: number;
    backgroundFill: string;
    stepsToComplete: number;
    state: CircStateInterface;
    protected shapes: ShapeInterface[] = [];
    modified: boolean;

    addShape(shape: ShapeInterface): void {
        shape.isRoot = (this.shapes.length === 0);
        this.shapes.push(shape);
        this.dispatchEvent(new ShapeAddEvent(shape))
    }

    removeShape(id: number): void {
        const shapesRemoved = [];
        this.shapes = this.shapes.filter((shape: ShapeInterface): boolean => {
            const remove = shape.id !== id;

            if (remove === true) {
                shapesRemoved.push(shape);
            }

            return remove;
        });

        shapesRemoved.forEach((shape: ShapeInterface) => {
            this.dispatchEvent(new ShapeDeleteEvent(shape));
        });
    }

    getShapes(): ShapeInterface[] {
        return this.shapes;
    }
}

const CircProxyHandler = {
    set: (target: Circ, propertyName: PropertyKey, value: any, receiver: any): boolean => {
        target[propertyName] = value;

        target.dispatchEvent(new AttributeChangedEvent(propertyName.toString(),value));

        target.modified = true;

        return true;
    },
};

const CircFactory = () => new Proxy<Circ>(new Circ(), CircProxyHandler);

export {
    Circ,
    CircFactory,
}
