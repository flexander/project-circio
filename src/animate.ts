import {EngineFactory} from "./modules/engine";
import Painter from './modules/painter';
import {BlueprintStore} from "./modules/storeBlueprint";
import {CircInterface, EngineInterface} from "./structure";
import BackgroundPainter from "./modules/backgroundPainter";
// import { createCanvas } from 'canvas';
const { createCanvas, loadImage } = require('canvas');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const canvas = createCanvas(1080, 1080);

const blueprintStorage = new BlueprintStore();
const circ = blueprintStorage.get('threeCircles');


const engine = EngineFactory();
const painter = new Painter(canvas.getContext('2d'));
const backgroundPainter = new BackgroundPainter(canvas.getContext('2d'));

engine.import(circ);
engine.addStepCallback((circ: CircInterface) => backgroundPainter.draw(circ));
engine.addStepCallback((circ: CircInterface) => painter.draw(circ));
engine.addResetCallback(_ => painter.clear());

const steps = args['steps'] !== undefined ? args['steps']: 1000;
const startFrame = args['start'] !== undefined ? args['start']: 1;
const endFrame = args['end'] !== undefined ? args['end']: 1;
const name = args['name'] !== undefined ? args['name']: Date.now();
const offset = 180;

const dir = __dirname + '/../output/' + name;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

for (let f = startFrame; f <= endFrame; f++) {
    console.log(f + ' of ' + endFrame);
    engine.reset();

    circ.getShapes()[2].brushes[0].degrees = f;

    if(f <= (2 * offset)) {
        circ.getShapes()[2].brushes[0].offset = (-1 * offset) + f;
    } else {
        circ.getShapes()[2].brushes[0].offset = offset - (f - (2 * offset));
    }

    let fileName = name + '/frame-'+ f.toString().padStart(10 , '0') +'.png';
    draw(fileName, engine);
}

function draw (fileName: string, engine: EngineInterface) {
    engine.stepFast(steps);

    const buffer = canvas.toBuffer();
    fs.writeFileSync(__dirname + '/../output/' + fileName, buffer);
}
