import {CircInterface} from "./structure";
import {Randomiser} from "./modules/randomiser";
import Serializer from "./modules/serializer";
import * as fs from "fs";

const outputFile = process.argv[2];

if (outputFile == null) {
    console.error('A file path must be specified');
    process.exit(1);
}

const randomiser = new Randomiser();
const serialiser = new Serializer();

const circJsonString = (fs.existsSync(outputFile) === true) ? fs.readFileSync(outputFile):'[]';
const circs = JSON.parse(circJsonString.toString());

function makeManyRandom() {
    randomiser.make()
        .then((circ: CircInterface) => {
            const items = serialiser.serialize(circ);
            circs.push(items);
            fs.writeFileSync(outputFile, JSON.stringify(circs, null,2));
            makeManyRandom();
        });
}
makeManyRandom();


