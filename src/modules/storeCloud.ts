import {CircInterface,CircStoreInterface} from "../structure";
import Serializer from "./serializer";

export default class CloudStorage implements CircStoreInterface {
    protected serializer = new Serializer();
    protected apiUrl = 'https://circio.mountainofcode.co.uk';
    public name: string = 'Cloud';

    public async get(name: string): Promise<CircInterface> {
        const response = await fetch(this.apiUrl + '?action=getByName&name=' + encodeURIComponent(name));
        const circJsonString = await response.text();

        const circ = this.serializer.unserialize(circJsonString);
        circ.modified = false;

        return circ;
    }

    public async getIndex(index: number): Promise<CircInterface> {
        const response = await fetch(this.apiUrl + '?action=getByIndex&index=' + encodeURIComponent(index));
        const circJsonString = await response.text();

        const circ = this.serializer.unserialize(circJsonString);
        circ.modified = false;

        return circ;
    }

    public list(): Promise<CircInterface[]> {
        return new Promise((resolve, reject) => {
            fetch(this.apiUrl + '?action=list')
                .then(response => {
                    response.json()
                        .then(circJsonStrings => {
                            const circs = circJsonStrings.map((circJsonString: string): CircInterface => {
                                const circ = this.serializer.unserialize(circJsonString);
                                circ.modified = false;

                                return circ;
                            });

                            resolve(circs)
                        });
                });
        });
    }

    public store(name: string, circ: CircInterface): void {
        circ.modified = null;
        const circJson = this.serializer.serialize(circ);
        fetch(this.apiUrl, {method: 'POST', body: circJson});
    }

    public delete(name: string): void {
    }

}
