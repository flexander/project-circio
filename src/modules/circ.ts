import {
    CircConfigInterface,
    CircInterface,
    CircleInterface,
    EventEmitter,
    ShapeInterface
} from "../structure";
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

    get modified(): boolean {
        return this.config.modified;
    }

    get stepsToComplete(): number {
        const stepsToCompletion = [];

        stepsToCompletion.push(this.getShapes()[0].steps);

        for(let shapeIndex=1;shapeIndex<this.getShapes().length;shapeIndex++) {
            const lastShape = (this.getShapes()[shapeIndex-1] as CircleInterface);
            const shape = (this.getShapes()[shapeIndex] as CircleInterface);

            const radiusRatio = (lastShape.radius/shape.radius);
            let multiple = null;

            for (let i = 1; i < 20; i++) {
                if ((radiusRatio * i) % 1 === 0) {
                    multiple = i;
                    break;
                }
            }

            if (multiple === null) {
                return Infinity;
            }

            stepsToCompletion.push(shape.steps*radiusRatio*multiple);
        }

        return this.lcmMany(stepsToCompletion.map((steps: number): number => Math.max(1,steps)));
    }

    protected lcmMany(array: number[]): number {
        return array.reduce((result: number, number: number): number => {
            return this.lcm(result, number);
        },1);
    }

    protected lcm(x, y) {
        return Math.abs((x * y) / this.gcd(x, y));
    }

    protected gcd(x, y) {
        x = Math.abs(x);
        y = Math.abs(y);
        while(y) {
            var t = y;
            y = x % y;
            x = t;
        }
        return x;
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
