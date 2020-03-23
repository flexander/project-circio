import {AttributeChangedEventInterface, EventInterface, ShapeInterface} from "../structure";

class AttributeChangedEvent implements AttributeChangedEventInterface {
    name: string;
    value: string | number | boolean;

    constructor(name: string, value: string | number | boolean) {
        this.name = name;
        this.value = value;
    }

    getName(): string {
        return "change." + this.name;
    }

    getContext(): any[] {
        return [this.value, this.name];
    }

}

class ShapeAddEvent implements EventInterface {
    protected shape: ShapeInterface;

    constructor(shape: ShapeInterface) {
        this.shape = shape;
    }

    getName(): string {
        return "shape.add";
    }

    getContext(): any[] {
        return [this.shape];
    }
}

class ShapeDeleteEvent implements EventInterface {
    protected shape: ShapeInterface;

    constructor(shape: ShapeInterface) {
        this.shape = shape;
    }

    getName(): string {
        return "shape.delete";
    }

    getContext(): any[] {
        return [this.shape];
    }
}

export {
    AttributeChangedEvent,
    ShapeAddEvent,
    ShapeDeleteEvent,
}
