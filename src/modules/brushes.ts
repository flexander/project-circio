import {BrushInterface, EventEmitter} from "../structure";
import {AttributeChangedEvent} from "./events";

class Brush extends EventEmitter implements BrushInterface {
    color: string = '#FFFFFF';
    transparency: number = 0;
    degrees: number = 0;
    draw: boolean = true;
    link: boolean = false;
    offset: number = 0;
    point: number = 0.5;

    public get colorWithAlpha(): string {
        return this.color + ('00' + (255-this.transparency).toString(16)).substr(-2);
    }
}

const BrushProxyHandler = {
    set: (target: Brush, propertyName: PropertyKey, value: any, receiver: any): boolean => {
        target[propertyName] = value;

        console.log(propertyName, value);

        target.dispatchEvent(new AttributeChangedEvent(propertyName.toString(),value));

        return true;
    },
};

const BrushFactory = () => new Proxy<Brush>(new Brush(), BrushProxyHandler);

export {
    Brush,
    BrushFactory,
}