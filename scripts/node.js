const Engine = require('../modules/engine');
const Painter = require('../modules/node-painter');
const { createCanvas, loadImage } = require('canvas');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
let redprints = {};

try {
    redprints = require('../storage/Redprints');
} catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
        console.log("Redprints not found");
    else
        throw e;
}

const canvas = createCanvas(1080, 1080);

const engine = new Engine({
    paused: false,
    interval: 2,
    height: 1080,
    width: 1080,
});

const painter = new Painter(engine, {
    canvas: canvas,
});

// Data
const data = redprints.spiro;
engine.import(data.engineData);
painter.import(data.painterData);

engine.addCallback(painter.drawCircles.bind(painter));

const steps = args['steps'] !== undefined ? args['steps']: 1000;
const startFrame = args['start'] !== undefined ? args['start']: 1;
const endFrame = args['end'] !== undefined ? args['end']: 1;
const name = (args['name'] !== undefined && args['name'] !== '') ? args['name']: Date.now();
const offset = 180;

const dir = __dirname + '/../output/' + name;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

for (let f = startFrame; f <= endFrame; f++) {
    console.log(f + ' of ' + endFrame);
    painter.fillBackground();
    engine.reset();

    painter.brushes[1][0].degrees = painter.brushes[1][0].degrees + f;
    painter.brushes[1][1].degrees = painter.brushes[1][0].degrees + f;
    painter.brushes[1][2].degrees = painter.brushes[1][0].degrees + f;

    //painter.brushes[3][0].offset = brushOffset(offset, f);
    //painter.brushes[3][0].offset = brushOffset(offset, f);
    //engine.list[3].radians = ((2 * Math.PI) / 720) * f;

    let fileName = name + '/frame-'+ f.toString().padStart(10 , '0') +'.png';
    draw(fileName, engine);
}

function draw (fileName, engine) {
    for (let s = 0; s < steps; s++) {
        engine.runOnce();
    }

    const buffer = canvas.toBuffer();
    fs.writeFileSync(__dirname + '/../output/' + fileName, buffer);
}

function brushOffset(offset, f) {
    if(f <= (2 * offset)) {
        return (-1 * offset) + f;
    } else {
        return offset - (f - (2 * offset));
    }
}
