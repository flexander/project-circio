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
    {"id":0,"radius":300,"clockwise":false,"outside":false,"steps":10000,"fixed":true},
    {"id":1,"radius":200,"clockwise":true,"outside":false,"steps":5000,"fixed":true},
    {"id":2,"radius":50,"clockwise":false,"outside":false,"steps":250,"fixed":true},
    {"id":3,"radius":15,"clockwise":true,"outside":false,"steps":125,"fixed":true}
]};
const painterData = {"painter":{"backgroundFill":"#ffffff"},
"brushes":[
    null,
    null,
    null,
    [{"color":"#00000050","point":1,"offset":0,"degrees":0,"link":false}]
]};

engine.import(engineData);
painter.import(painterData);

engine.addCallback(painter.drawCircles.bind(painter));

const steps = args['steps'] !== undefined ? args['steps']: 1000;
const startFrame = args['start'] !== undefined ? args['start']: 1;
const endFrame = args['end'] !== undefined ? args['end']: 1;
const name = args['name'] !== undefined ? args['name']: Date.now();
const offset = 180;

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
