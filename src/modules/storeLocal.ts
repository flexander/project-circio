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
        const keys = Object.keys(window.localStorage)
            .filter((key: string) => {
                return key.startsWith(this.storeName);
            })
            .map((key: string) => {
                return key.replace(this.storeName + '.', '');
            });

        return keys.map((circKey: string) => this.get(circKey));
    }

    public store(name: string, circ: CircInterface): void {
        const circJson = this.serializer.serialize(circ);

        window.localStorage.setItem(`${this.storeName}.${name}`, circJson);
    }

}
