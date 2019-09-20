import {AttributeChangedEventInterface, EventInterface} from "../structure";

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

export {
    AttributeChangedEvent,
    EnginePauseEvent,
    EnginePlayEvent,
}
