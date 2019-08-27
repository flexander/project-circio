import Circ from "./circ";
import Brush from "./brushes";
import {Circle, CircleCenterPosition, CircleDrawPosition, CircleState} from "./circle";
import {CircInterface, SerializerInterface} from "../structure";

export default class Serializer implements SerializerInterface {
    protected classes = {
        Circ,
        Circle,
        CircleCenterPosition,
        CircleDrawPosition,
        CircleState,
        Brush,
    };

    public serialize(circ: CircInterface): string {
        return JSON.stringify(circ, this.replace.bind(this));
    }

    public unserialize(circJson: string): CircInterface {
        return JSON.parse(circJson, this.revive.bind(this));
    }

    protected replace(key: string, value: any) {
        if (value instanceof Object) {
            value.__type = value.constructor.name;
        }

        return value;
    }

    protected revive(key: string, value: any) {
        if (value instanceof Object === false || typeof value.__type !== 'string') {
            return value;
        }

        const p = this.makeClass(value.__type);
        Object.getOwnPropertyNames(value).forEach(function (k) {
            p[k] = value[k];
        });

        delete p.__type;

        return p;
    }

    protected makeClass(className: string) {

        if (typeof this.classes[className] === 'undefined') {
            throw `Unknown class ${className}`;
        }

        return new this.classes[className]();
    }

}