import Painter from './modules/painter';
import {BlueprintStore} from "./modules/storeBlueprint";
import CloudStorage from "./modules/storeCloud";
import {CircInterface, EngineInterface} from "./structure";
import BackgroundPainter from "./modules/backgroundPainter";
import {Engine} from "./modules/engine";
// import { createCanvas } from 'canvas';
const { createCanvas, loadImage } = require('canvas');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const canvas = createCanvas(1080, 1080);

const blueprintStorage = new BlueprintStore();
const cloudStorage = new CloudStorage();


const engine = new Engine();
const painter = new Painter(canvas.getContext('2d'));
const backgroundPainter = new BackgroundPainter(canvas.getContext('2d'));

engine.addStepCallback((circ: CircInterface) => painter.draw(circ));
engine.addResetCallback(_ => painter.clear());

const steps = args['steps'] !== undefined ? args['steps']: 1000;
const startFrame = args['start'] !== undefined ? args['start']: 1;
const endFrame = args['end'] !== undefined ? args['end']: 1;
const name = args['name'] !== undefined ? args['name']: Date.now();
const offset = 180;

const dir = __dirname + '/output/' + name;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

cloudStorage.get('Angry Bird 2')
    .then(async function (circ: CircInterface)  {
        engine.import(circ);

        for (let f = startFrame; f <= endFrame; f++) {
            console.log(f + ' of ' + endFrame);
            engine.reset();
            backgroundPainter.draw(circ);

            //circ.getShapes()[5].getBrushes()[0].degrees = f;

            if(f <= (2 * offset)) {
                circ.getShapes()[5].getBrushes()[0].offset = (-1 * offset) + f;
            } else {
                circ.getShapes()[5].getBrushes()[0].offset = offset - (f - (2 * offset));
            }

            let fileName = name + '/frame-'+ f.toString().padStart(10 , '0') +'.png';
            await draw(fileName, engine);
        }
    });


async function draw (fileName: string, engine: EngineInterface) {
    await engine.stepFast(steps);
    const buffer = canvas.toBuffer();
    fs.writeFileSync(__dirname + '/output/' + fileName, buffer);
}
