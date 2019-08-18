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
        {"id":0,"radius":5,"clockwise":true,"outside":false,"steps":0,"fixed":true, radians: (Math.PI * 1.5)},
        {"id":1,"radius":100,"clockwise":true,"outside":true,"steps":40000,"fixed":true},
        {"id":2,"radius":50,"clockwise":false,"outside":false,"steps":500,"fixed":true},
        {"id":3,"radius":25,"clockwise":false,"outside":true,"steps":1000,"fixed":true},
        {"id":4,"radius":25,"clockwise":false,"outside":false,"steps":1000,"fixed":true},
    ]};
const painterData = {"painter":{"backgroundFill":"#222222"},
    "brushes":[
        null,
        null,
        null,
        null,
        [{"color":"#e51c4620","point":2,"offset":0,"degrees":0,"link":false}]
    ]};

engine.import(engineData);
painter.import(painterData);

engine.addCallback(painter.drawCircles.bind(painter));

const steps = args['steps'] !== undefined ? args['steps']: 1000;
const startFrame = args['start'] !== undefined ? args['start']: 1;
const endFrame = args['end'] !== undefined ? args['end']: 1;
const project = args['project'] !== undefined ? args['project']: Date.now();
const offset = 180;

const dir = __dirname + '/../output/' + project;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

for (let f = startFrame; f <= endFrame; f++) {
    console.log(f + ' of ' + endFrame);
    painter.fillBackground();
    engine.reset();

    painter.brushes[4][0].degrees = f;

    if(f <= (2 * offset)) {
        painter.brushes[4][0].offset = (-1 * offset) + f;
    } else {
        painter.brushes[4][0].offset = offset - (f - (2 * offset));
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
