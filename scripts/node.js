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

const data = {
    "engineData":{
        "engine":{"height":1080,"width":1080},
        "list":[
            {"id":0,"radius":150,"clockwise":true,"outside":false,"steps":2,"fixed":true, "radians": Math.PI/2},
            {"id":1,"radius":75,"clockwise":false,"outside":true,"steps":500,"fixed":true},
            {"id":2,"radius":25,"clockwise":true,"outside":false,"steps":500,"fixed":false}
        ]
    },
    "painterData":{
        "painter":{"backgroundFill":"#000000"},
        "brushes":[
            null,
            null,
            [{"color":"#FFFfff05","point":0.5,"offset":0,"degrees":0,"link":true}]
        ]
    }
};

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

    painter.brushes[2][0].degrees = f;
    painter.brushes[2][0].offset = brushOffset(offset, f);
    engine.list[2].radians = ((2 * Math.PI) / 720) * f;

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
