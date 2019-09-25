import {CircInterface,CircStoreInterface} from "../structure";
import Serializer from "./serializer";

export default class CloudStorage implements CircStoreInterface {
    protected storeName = 'store.v2';
    protected serializer = new Serializer();

    public get(name: string): CircInterface {
        let circJson = ;

        return this.serializer.unserialize(circJson);
    }

    public getIndex(index: number): CircInterface {
    }

    public list(): CircInterface[] {
    }

    public store(name: string, circ: CircInterface): void {
        const circJson = this.serializer.serialize(circ);

    }

    public delete(name: string): void {
    }

}
