import {CircInterface} from "./structure";
import {Randomiser} from "./modules/randomiser";
import Serializer from "./modules/serializer";
const fs = require('fs');

const randomiser = new Randomiser();
const serialiser = new Serializer();

const circJsonString = fs.readFileSync('randomCircStore.json');
const circs = JSON.parse(circJsonString);

randomiser.make()
    .then((circ: CircInterface) => {
        const items = serialiser.serialize(circ);
        circs.push(items);
        fs.writeFileSync('randomCircStore.json', JSON.stringify(circs));
    });


