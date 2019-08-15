const Engine = require('../modules/engine');
const Painter = require('../modules/node-painter');
const { createCanvas, loadImage } = require('canvas');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const canvas = createCanvas(1080, 1080);
const stream = canvas.createPNGStream();

const engineData = {"engine":{"interval":2,"height":1080,"width":1080,"paused":false},"list":[{"id":0,"radius":400,"clockwise":false,"outside":false,"steps":10000,"fixed":true,"stepMod":0},{"id":1,"radius":200,"clockwise":true,"outside":false,"steps":500,"fixed":true,"stepMod":0},{"id":2,"radius":100,"clockwise":false,"outside":false,"steps":250,"fixed":true,"stepMod":0},{"id":3,"radius":50,"clockwise":true,"outside":false,"steps":125,"fixed":true,"stepMod":0}]};
const painterData = {"painter":{"draw":true,"color":"#ffffff","point":0.5,"backgroundFill":"#202020"},"brushes":[null,null,null,[{"color":"#ffffff","point":1,"offset":-400,"degrees":0,"link":false}]]};

const engine = new Engine({
    paused: false,
    interval: 2,
    height: 1080,
    width: 1080,
});

const painter = new Painter(engine, {
    backgroundFill: "#1b374c",
    showGuide: true,
    color: '#ffffff',
    canvas: canvas,
});

engine.import(engineData);
painter.import(painterData);

engine.addCallback(painter.drawCircles.bind(painter));

const steps = args['steps'] !== undefined ? args['steps']: 1000;
const frames = args['frames'] !== undefined ? args['frames']: 1;

for (let f = 0; f < frames; f++) {
    painter.fillBackground();
    let fileName = 'frame-'+ f.toString().padStart(frames.toString().length, '0') +'.png';
    const out = fs.createWriteStream(__dirname + '/../output/'+fileName);
    console.log(fileName);

    for (let s = 0; s < steps; s++) {
        engine.runOnce();
    }

    stream.pipe(out);
}
