const Engine = require('../modules/engine');
const Painter = require('../modules/node-painter');
const { createCanvas, loadImage } = require('canvas');

const fs = require('fs');

const canvas = createCanvas(this.width, this.height);

const data = {"engineData":{"engine":{"interval":2,"height":1080,"width":1080,"paused":false},"list":[{"id":0,"radius":400,"clockwise":false,"outside":false,"steps":10000,"fixed":true,"stepMod":0},{"id":1,"radius":200,"clockwise":true,"outside":false,"steps":500,"fixed":true,"stepMod":0},{"id":2,"radius":100,"clockwise":false,"outside":false,"steps":250,"fixed":true,"stepMod":0},{"id":3,"radius":50,"clockwise":true,"outside":false,"steps":125,"fixed":true,"stepMod":0}]},"painterData":{"painter":{"draw":true,"color":"#ffffff","point":0.5,"backgroundFill":"#202020"},"brushes":[null,null,null,[{"color":"#ffffff","point":1,"offset":-400,"degrees":0,"link":false}]]}};

const engine = new Engine({
    paused: false,
    interval: 2,
    height: 1080,
    width: 1080,
});

const painter = new Painter(engine, {
    backgroundFill: "#000000",
    showGuide: true,
    color: '#ffffff',
    canvas: canvas,
});

engine.import(data.engineData);

painter.import(data.painterData);

engine.addCallback(painter.drawCircles.bind(painter));

const out = fs.createWriteStream(__dirname + '/test.jpeg');
const stream = canvas.createJPEGStream();

for (let i = 0; i < 1000; i++) {
    console.log(i);
    engine.runOnce();
}

stream.pipe(out);
out.on('finish', () =>  console.log('The JPEG file was created.'));
