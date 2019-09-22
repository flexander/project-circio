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

class EnginePauseEvent implements EventInterface {
    getName(): string {
        return "pause";
    }

    getContext(): any[] {
        return [];
    }
}

class EnginePlayEvent implements EventInterface {
    getName(): string {
        return "play";
    }

    getContext(): any[] {
        return [];
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

export {
    AttributeChangedEvent,
    EnginePauseEvent,
    EnginePlayEvent,
    ShapeAddEvent
}
