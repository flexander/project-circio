const Engine = require('../modules/engine');
const Painter = require('../modules/node-painter');
const { createCanvas, loadImage } = require('canvas');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');

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

const engineData = {"engine":{"height":1080,"width":1080},
    "list":[
        {"id":0,"radius":200,"clockwise":false,"outside":false,"steps":6,"fixed":true,"stepMod":0},
        {"id":1,"radius":5,"clockwise":true,"outside":true,"steps":0,"fixed":true,"stepMod":0},
        {"id":2,"radius":100,"clockwise":false,"outside":false,"steps":5000,"fixed":false,"stepMod":0},
        {"id":3,"radius":50,"clockwise":true,"outside":false,"steps":2,"fixed":false,"stepMod":0}
    ]};
const painterData = {"painter":{"backgroundFill":"#3f3f57"},
    "brushes":[
        null,
        null,
        null,
        [{"color":"rgba(28,255,40,0.19)","point":0.5,"offset":100,"degrees":0,"link":true}]
    ]};

engine.import(engineData);
painter.import(painterData);

engine.addCallback(painter.drawCircles.bind(painter));

const steps = args['steps'] !== undefined ? args['steps']: 1000;
const startFrame = args['start'] !== undefined ? args['start']: 1;
const endFrame = args['end'] !== undefined ? args['end']: 1;
const project = args['project'] !== undefined ? args['project']: Date.now();
const offset = 150;

const dir = __dirname + '/../output/' + project;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

for (let f = startFrame; f <= endFrame; f++) {
    console.log(f + ' of ' + endFrame);
    painter.fillBackground();
    engine.reset();

    painter.brushes[3][0].degrees = f;

    if(f <= (2 * offset)) {
        painter.brushes[3][0].offset = (-1 * offset) + f;
    } else {
        painter.brushes[3][0].offset = offset - (f - (2 * offset));
    }

    let fileName = project + '/frame-'+ f.toString().padStart(10 , '0') +'.png';
    draw(fileName, engine);
}

function draw (fileName, engine) {
    for (let s = 0; s < steps; s++) {
        engine.runOnce();
    }

    const buffer = canvas.toBuffer();
    fs.writeFileSync(__dirname + '/../output/' + fileName, buffer);
}
