import {CircConfigInterface, CircInterface, CircStateInterface, EventEmitter, ShapeInterface} from "../structure";
import {AttributeChangedEvent, ShapeAddEvent, ShapeDeleteEvent} from "./events";

class Circ extends EventEmitter implements CircInterface {
    protected config: CircConfigInterface = new CircConfig();
    protected shapes: ShapeInterface[] = [];

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

    get name(): string {
        return this.config['name'];
    }

    set name(name: string) {
        this.config['name'] = name;
        this.dispatchEvent(new AttributeChangedEvent('name', this.name));
    }

    get height(): number {
        return this.config.height;
    }

    set height(height: number) {
        this.config.height = height;
        this.dispatchEvent(new AttributeChangedEvent('height', this.height));
    }

    get width(): number {
        return this.config.width;
    }

    set width(width: number) {
        this.config.width = width;
        this.dispatchEvent(new AttributeChangedEvent('width', this.width));
    }

    get backgroundFill(): string {
        return this.config.backgroundFill;
    }

    set backgroundFill(backgroundFill: string) {
        this.config.backgroundFill = backgroundFill;
        this.dispatchEvent(new AttributeChangedEvent('backgroundFill', this.backgroundFill));
    }

    get stepsToComplete(): number {
        return this.config.stepsToComplete;
    }

    set stepsToComplete(stepsToComplete: number) {
        this.config.stepsToComplete = stepsToComplete;
        this.dispatchEvent(new AttributeChangedEvent('stepsToComplete', this.stepsToComplete));
    }

    get modified(): boolean {
        return this.config.modified;
    }
}

class CircConfig implements CircConfigInterface {
    name: string;
    height: number;
    width: number;
    backgroundFill: string;
    stepsToComplete: number;
    modified: boolean;
}

export {
    Circ,
    CircConfig,
}
