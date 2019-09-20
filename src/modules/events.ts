import {AttributeChangedEventInterface} from "../structure";

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

export {
    AttributeChangedEvent,
}
