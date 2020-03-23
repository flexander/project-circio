import {CircInterface} from "./structure";
import {CircleConfigGenerator, NumberGenerator, Randomiser} from "./modules/randomiser";
import Serializer from "./modules/serializer";
import * as fs from "fs";

const outputFile = process.argv[2];

if (outputFile == null) {
    console.error('A file path must be specified');
    process.exit(1);
}

const randomiser = new Randomiser();
const serialiser = new Serializer();

const rootCircle = new CircleConfigGenerator();
rootCircle.radiusGenerator = new NumberGenerator(150, 250);
rootCircle.stepGenerator = new NumberGenerator(0,0);

const shapeConfigGenerators = [
    rootCircle,
    new CircleConfigGenerator,
    new CircleConfigGenerator,
];

async function makeManyRandom() {
    while(true) {
        await randomiser.make(shapeConfigGenerators)
            .then((circ: CircInterface) => {
                console.log(circ.stepsToComplete + ' step Circ found');

                const circJsonString = (fs.existsSync(outputFile) === true) ? fs.readFileSync(outputFile):'[]';
                const circs = JSON.parse(circJsonString.toString());

                circs.push(serialiser.serialize(circ));
                fs.writeFileSync(outputFile, JSON.stringify(circs, null,2));
            });
    }
}

makeManyRandom();

