"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = require("./modules/engine");
var painter_1 = require("./modules/painter");
var storeBlueprint_1 = require("./modules/storeBlueprint");
var backgroundPainter_1 = require("./modules/backgroundPainter");
// import { createCanvas } from 'canvas';
var _a = require('canvas'), createCanvas = _a.createCanvas, loadImage = _a.loadImage;
var args = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var canvas = createCanvas(1080, 1080);
var blueprintStorage = new storeBlueprint_1.BlueprintStore();
var engine = engine_1.EngineFactory();
var painter = new painter_1.default(canvas.getContext('2d'));
var backgroundPainter = new backgroundPainter_1.default(canvas.getContext('2d'));
engine.addStepCallback(function (circ) { return backgroundPainter.draw(circ); });
engine.addStepCallback(function (circ) { return painter.draw(circ); });
engine.addResetCallback(function (_) { return painter.clear(); });
var steps = args['steps'] !== undefined ? args['steps'] : 1000;
var startFrame = args['start'] !== undefined ? args['start'] : 1;
var endFrame = args['end'] !== undefined ? args['end'] : 1;
var name = args['name'] !== undefined ? args['name'] : Date.now();
var offset = 180;
var dir = __dirname + '/../output/' + name;
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
blueprintStorage.get('threeCircles')
    .then(function (circ) {
    engine.import(circ);
    for (var f = startFrame; f <= endFrame; f++) {
        console.log(f + ' of ' + endFrame);
        engine.reset();
        circ.getShapes()[2].brushes[0].degrees = f;
        if (f <= (2 * offset)) {
            circ.getShapes()[2].brushes[0].offset = (-1 * offset) + f;
        }
        else {
            circ.getShapes()[2].brushes[0].offset = offset - (f - (2 * offset));
        }
        var fileName = name + '/frame-' + f.toString().padStart(10, '0') + '.png';
        draw(fileName, engine);
    }
});
function draw(fileName, engine) {
    engine.stepFast(steps);
    var buffer = canvas.toBuffer();
    fs.writeFileSync(__dirname + '/../output/' + fileName, buffer);
}
