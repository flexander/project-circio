import {CircInterface,CircStoreInterface} from "../structure";
import Serializer from "./serializer";

export default class LocalStorage implements CircStoreInterface {
    protected storeName = 'store.v2';
    protected serializer = new Serializer();
    public name: string = 'Browser';

    public get(name: string): Promise<CircInterface> {
        return new Promise((resolve, reject) => {
            let circJson = window.localStorage.getItem(`${this.storeName}.${name}`);

            const circ = this.serializer.unserialize(circJson);
            circ.modified = false;

            resolve(circ);
        });
    }

    public getIndex(index: number): Promise<CircInterface> {
        return new Promise((resolve, reject) => {
            if(typeof index !== 'number') {
                throw 'Provide a valid index';
            }

            this.list().then((circList: CircInterface[]) => {
                const circ = circList[index];

                if (circ === null) {
                    throw 'No data found';
                }

                resolve(circ);
            });

        });
    }

    public list(): Promise<CircInterface[]> {
        return new Promise((resolve, reject) => {
            const keys = Object.keys(window.localStorage)
                .filter((key: string) => {
                    return key.startsWith(this.storeName);
                })
                .map((key: string) => {
                    return key.replace(this.storeName + '.', '');
                });

            const circPromises = keys.map((circKey: string): Promise<CircInterface> => {
                return this.get(circKey)
            });

            Promise.all(circPromises).then((circs: CircInterface[]) => {
                resolve(circs)
            });
        });
    }

    public store(name: string, circ: CircInterface): void {
        circ.modified = null;
        const circJson = this.serializer.serialize(circ);

        window.localStorage.setItem(`${this.storeName}.${name}`, circJson);
    }

    public delete(name: string): void {
        window.localStorage.removeItem(name);
    }

}
