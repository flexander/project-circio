import {CircInterface, CircStoreInterface} from "../structure";
import {Circle} from "./circle";
import {Brush} from "./brushes";
import {Circ} from "./circ";
import CloudStorage from "./storeCloud";
import Serializer from "./serializer";

export class StoreRandom implements CircStoreInterface {
    protected serializer = new Serializer();
    public name: string = 'Randomiser';
    protected apiUrl = 'https://circio.mountainofcode.co.uk/random/';

    public async get(): Promise<CircInterface> {
        const response = await fetch(this.apiUrl + '?action=get');
        const circJsonString = await response.text();

        const circ = this.serializer.unserialize(circJsonString);
        circ.name = 'Random';

        return circ;
    }

    public getIndex(): Promise<CircInterface> {
        return this.get();
    }

    public list(): Promise<CircInterface[]> {
        return new Promise((resolve, reject) => {
            const circs = Promise.all([
                this.get(),
                this.get(),
                this.get(),
                this.get(),
            ]);

            resolve(circs);
        });
    }

    public delete(name: string): void {
        throw new Error("Random Circs can't be deleted.");
    }

    store(name: string, circ: CircInterface): void {
        throw new Error("Random Circs can't be stored.");
    }
}
