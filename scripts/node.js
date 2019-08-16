const Engine = require('../modules/engine');
const Painter = require('../modules/node-painter');
const { createCanvas, loadImage } = require('canvas');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const canvas = createCanvas(1080, 1080);

// const engineData = {"engine":{"interval":2,"height":1080,"width":1080,"paused":false},"list":[{"id":0,"radius":400,"clockwise":false,"outside":false,"steps":10000,"fixed":true,"stepMod":0},{"id":1,"radius":200,"clockwise":true,"outside":false,"steps":500,"fixed":true,"stepMod":0},{"id":2,"radius":100,"clockwise":false,"outside":false,"steps":250,"fixed":true,"stepMod":0},{"id":3,"radius":50,"clockwise":true,"outside":false,"steps":125,"fixed":true,"stepMod":0}]};
// const painterData = {"painter":{"draw":true,"color":"#ffffff","point":0.5,"backgroundFill":"#1b374c"},"brushes":[null,null,null,[{"color":"#ffffff","point":1,"offset":0,"degrees":0,"link":false}]]};

// const engineData = {"engine":{"interval":2,"height":1080,"width":1080,"paused":true},"list":[{"id":0,"radius":252,"clockwise":false,"outside":false,"steps":0,"fixed":true,"stepMod":0},{"id":1,"radius":126,"clockwise":true,"outside":false,"steps":500,"fixed":true,"stepMod":0},{"id":2,"radius":72,"clockwise":false,"outside":true,"steps":500,"fixed":true,"stepMod":0},{"id":3,"radius":36,"clockwise":true,"outside":false,"steps":50,"fixed":true,"stepMod":0}]}
// const painterData = {"painter":{"draw":true,"color":"#ffffff","point":0.5,"backgroundFill":"#000000"},"brushes":[null,null,null,[{"color":"#ff98eb","point":2,"offset":0,"degrees":0,"link":false}]]}

// 28 : 60000
// const engineData = {"engine":{"height":1080,"width":1080},
//     "list":[
//         {"id":0,"radius":200,"clockwise":false,"outside":false,"steps":0,"fixed":true,"stepMod":0},
//         {"id":1,"radius":300,"clockwise":true,"outside":false,"steps":500,"fixed":true,"stepMod":0},
//         {"id":2,"radius":25,"clockwise":false,"outside":false,"steps":5000,"fixed":false,"stepMod":0}
//     ]};
// const painterData = {"painter":{"backgroundFill":"#ffffff"},
//     "brushes":[
//         null,
//         null,
//         [{"color":"#00000030","point":1,"offset":0,"degrees":0,"link":false}]
//     ]};

// 31 : 5000
// const engineData = {"engine":{"height":1080,"width":1080},
//     "list":[
//         {"id":0,"radius":50,"clockwise":false,"outside":false,"steps":1000,"fixed":true,"stepMod":0},
//         {"id":1,"radius":50,"clockwise":true,"outside":true,"steps":500,"fixed":true,"stepMod":0},
//         {"id":2,"radius":60,"clockwise":false,"outside":true,"steps":250,"fixed":true,"stepMod":0},
//         {"id":3,"radius":30,"clockwise":true,"outside":true,"steps":125,"fixed":true,"stepMod":0}
//     ]};
// const painterData = {"painter":{"backgroundFill":"#ffffff"},
//     "brushes":[
//         null,
//         null,
//         null,
//         [{"color":"#00000080","point":2,"offset":10,"degrees":0,"link":false}]
//     ]};

// 33 : 63000
const engineData = {"engine":{"height":1080,"width":1080},
    "list":[
        {"id":0,"radius":90,"clockwise":true,"outside":false,"steps":1000,"fixed":true,"stepMod":0},
        {"id":1,"radius":70,"clockwise":false,"outside":true,"steps":500,"fixed":true,"stepMod":0},
        {"id":2,"radius":70,"clockwise":true,"outside":true,"steps":250,"fixed":true,"stepMod":0},
        {"id":3,"radius":10,"clockwise":false,"outside":false,"steps":250,"fixed":true,"stepMod":0}
    ]};
const painterData = {"painter":{"backgroundFill":"#ffffff"},
    "brushes":[
        null,
        null,
        null,
        [{"color":"#00000080","point":1,"offset":0,"degrees":0,"link":false}]
    ]};

const engine = new Engine({
    height: 1080,
    width: 1080,
});

const painter = new Painter(engine, {
    canvas: canvas,
});

engine.import(engineData);
painter.import(painterData);

engine.addCallback(painter.drawCircles.bind(painter));

const steps = args['steps'] !== undefined ? args['steps']: 1000;
const startFrame = args['start'] !== undefined ? args['start']: 1;
const endFrame = args['end'] !== undefined ? args['end']: 1;
const project = args['project'] !== undefined ? args['project']: Date.now();

const dir = __dirname + '/../output/' + project;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

for (let f = startFrame; f <= endFrame; f++) {
    console.log(f + ' of ' + endFrame);
    painter.fillBackground();
    engine.reset();

    //painter.brushes[2][0].degrees = f;

    if(f > 400) {
        painter.brushes[3][0].offset = 200 - (f - 400);
    } else {
        painter.brushes[3][0].offset = -200 + f;
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
