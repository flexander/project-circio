"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var painter_1 = require("./modules/painter");
var storeBlueprint_1 = require("./modules/storeBlueprint");
var storeCloud_1 = require("./modules/storeCloud");
var backgroundPainter_1 = require("./modules/backgroundPainter");
var engine_1 = require("./modules/engine");
// import { createCanvas } from 'canvas';
var _a = require('canvas'), createCanvas = _a.createCanvas, loadImage = _a.loadImage;
var args = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var canvas = createCanvas(1080, 1080);
var blueprintStorage = new storeBlueprint_1.BlueprintStore();
var cloudStorage = new storeCloud_1.default();
var engine = new engine_1.Engine();
var painter = new painter_1.default(canvas.getContext('2d'));
var backgroundPainter = new backgroundPainter_1.default(canvas.getContext('2d'));
engine.addStepCallback(function (circ) { return painter.draw(circ); });
engine.addResetCallback(function (_) { return painter.clear(); });
var steps = args['steps'] !== undefined ? args['steps'] : 1000;
var startFrame = args['start'] !== undefined ? args['start'] : 1;
var endFrame = args['end'] !== undefined ? args['end'] : 1;
var name = args['name'] !== undefined ? args['name'] : Date.now();
var offset = 180;
var dir = __dirname + '/output/' + name;
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
cloudStorage.get('Angry Bird 2')
    .then(function (circ) {
    return __awaiter(this, void 0, void 0, function () {
        var f, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine.import(circ);
                    f = startFrame;
                    _a.label = 1;
                case 1:
                    if (!(f <= endFrame)) return [3 /*break*/, 4];
                    console.log(f + ' of ' + endFrame);
                    engine.reset();
                    backgroundPainter.draw(circ);
                    //circ.getShapes()[5].getBrushes()[0].degrees = f;
                    if (f <= (2 * offset)) {
                        circ.getShapes()[5].getBrushes()[0].offset = (-1 * offset) + f;
                    }
                    else {
                        circ.getShapes()[5].getBrushes()[0].offset = offset - (f - (2 * offset));
                    }
                    fileName = name + '/frame-' + f.toString().padStart(10, '0') + '.png';
                    return [4 /*yield*/, draw(fileName, engine)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    f++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
});
function draw(fileName, engine) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, engine.stepFast(steps)];
                case 1:
                    _a.sent();
                    buffer = canvas.toBuffer();
                    fs.writeFileSync(__dirname + '/output/' + fileName, buffer);
                    return [2 /*return*/];
            }
        });
    });
}
