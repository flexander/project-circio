import {CircInterface,CircStoreInterface} from "../structure";
import Serializer from "./serializer";

export default class LocalStorage implements CircStoreInterface {
    protected storeName = 'store.v2';
    protected serializer = new Serializer();

    public get(name: string): CircInterface {
        let circJson = window.localStorage.getItem(`${this.storeName}.${name}`);

        return this.serializer.unserialize(circJson);
    }

    public getIndex(index: number): CircInterface {
        if(typeof index !== 'number') {
            throw 'Provide a valid index';
        }

        const circ = this.list()[index];

        if (circ === null) {
            throw 'No data found';
        }

        return circ;
    }

    public list(): CircInterface[] {
        return Object.keys(window.localStorage)
            .filter(key => {
                return key.startsWith(this.storeName);
            })
            .map(circJson => {
                return this.serializer.unserialize(circJson);
            });
    }

    public store(name: string, circ: CircInterface): void {
        const circJson = this.serializer.serialize(circ);

        window.localStorage.setItem(`${this.storeName}.${name}`, circJson);
    }

}