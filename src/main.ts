import Painter from "./modules/painter";
import GuidePainter from "./modules/guidePainter";
import {BlueprintStore} from "./modules/storeBlueprint";
import BackgroundPainter from "./modules/backgroundPainter";
import ControlPanel from "./modules/controls/panel";
import EngineControl from "./modules/controls/engine";
import CircControl from "./modules/controls/circ";
import GuidePainterControl from "./modules/controls/guidePainter";
import PainterControl from "./modules/controls/painter";
import StorageControl from "./modules/controls/storage";
import {BrushInterface, CircInterface, ShapeInterface} from "./structure";
import CloudStorage from "./modules/storeCloud";
import LocalStorage from "./modules/storeLocal";
import {ControlModes, ModeControl} from "./modules/controls/mode";
import {Engine} from "./modules/engine";
import {StoreRandom} from "./modules/storeRandom";
import {Circ} from "./modules/circ";
import {Circle} from "./modules/circle";
import {Brush} from "./modules/brushes";

const canvasArea = <HTMLElement>document.querySelector('#circio .painter');
const backgroundCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#background-canvas');
const mainCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#main-canvas');
const guideCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#guide-canvas');
const blueprintStorage = new BlueprintStore();
const storageCloud = new CloudStorage();
const storageLocal = new LocalStorage();
const storageBlueprint = new BlueprintStore();
const storageRandom = new StoreRandom();
let controlMode = window.localStorage.getItem('config.controlMode') || ControlModes.MODE_DEFAULT;

const renderControls = (circ: CircInterface) => {
    const controlPanel = new ControlPanel('Engine');
    const engineControl = new EngineControl(engine, controlMode);
    const circControl = new CircControl(circ, controlMode);
    const guidePainterControl = new GuidePainterControl(guidePainter);
    const painterControl = new PainterControl(painter);
    const storageControl = new StorageControl([storageCloud, storageLocal, storageBlueprint,storageRandom], engine);
    const modeControl = new ModeControl(controlMode);

    controlPanel.addControl(guidePainterControl);
    controlPanel.addControl(engineControl);
    engineControl.addCircControl(circControl);

    const quickControls = new ControlPanel();
    quickControls.addControls(guidePainterControl.getQuickControls());
    quickControls.addControls(engineControl.getQuickControls());
    quickControls.addControls(painterControl.getQuickControls());
    quickControls.addControls(painterControl.getQuickControls());
    quickControls.addControls(storageControl.getQuickControls());
    quickControls.addControls(modeControl.getQuickControls());

    const controlActionsEl = document.querySelector('.controls-container .actions');
    const controlsEl = document.querySelector('.controls-container .controls');

    controlActionsEl.innerHTML = null;
    controlsEl.innerHTML = null;

    controlActionsEl.appendChild(quickControls.render());
    controlsEl.appendChild(controlPanel.render());
    modeControl.addEventListener('controls.mode', (newMode: string) => {
        controlMode = newMode;
        window.localStorage.setItem('config.controlMode', newMode);
        renderControls(circ)
    });
};

const initialiseEventListeners = (circ: CircInterface) => {
    circ.addEventListeners(['shape.add', "shape.delete"], (shape: ShapeInterface) => renderControls(circ));
    circ.addEventListener('change.backgroundFill', _ => {
        backgroundPainter.draw(circ);
        guidePainter.draw(circ);
    });
    circ.getShapes().forEach((shape: ShapeInterface): void => {
        shape.getBrushes().forEach((brush: BrushInterface): void => {
            brush.addEventListener('change', (value) => {
                guidePainter.draw(circ);
            });
        });
    })
};


const engine = new Engine();
const painter = new Painter(mainCanvasElement.getContext("2d"));
const guidePainter = new GuidePainter(guideCanvasElement.getContext("2d"));
const backgroundPainter = new BackgroundPainter(backgroundCanvasElement.getContext("2d"));

engine.addStepCallback(circ => painter.draw(circ));
engine.addStepCallback(circ => guidePainter.draw(circ));
engine.addResetCallback(_ => painter.clear());
engine.addImportCallback(renderControls);
engine.addImportCallback(initialiseEventListeners);
engine.addImportCallback((circ: CircInterface) => {backgroundPainter.draw(circ)});
// engine.play();

// blueprintStorage.get('twoCircles')
//     .then((circ: CircInterface) => {
//         canvasArea.style.transformOrigin = '0 0'; //scale f2rom top left
//         canvasArea.style.transform = 'scale(' + window.innerHeight / circ.height + ')';
//         canvasArea.style.width = circ.width + 'px';
//         canvasArea.style.height = circ.height + 'px';
//
//         canvasArea.querySelectorAll('canvas').forEach(c => {
//             c.setAttribute('height', canvasArea.style.height);
//             c.setAttribute('width', canvasArea.style.width);
//         });
//
//         engine.import(circ);
//     });
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function runRandom() {
    const pr = 300;
    const cr = getRandomInt(100, 400);
    const cs = 500;
    const ratio = pr / cr;
    let multiple = null;

    for (let i = 1; i < 10; i++) {
        // console.log(pr,cr,i);
        if ((ratio * i) % 1 === 0) {
            multiple = i;
            break;
        }
    }
    if (multiple == null) {
        runRandom();
        return;
    }
    const stepsToComplete = cs*ratio*multiple;
    console.log(pr,cr,multiple, stepsToComplete);

    const circ = new Circ();
    circ.width = 1080;
    circ.height = 1080;
    circ.backgroundFill = '#1b5eec';


    const circle = new Circle();
    circle.steps = 100;
    circle.outside = true;
    circle.fixed = true;
    circle.clockwise = true;
    circle.stepMod = 0;
    circle.startAngle = 0;
    circle.radius = pr;


    const circle1 = new Circle();
    circle1.steps = cs;
    circle1.outside = true;
    circle1.fixed = true;
    circle1.clockwise = true;
    circle1.stepMod = 0;
    circle1.startAngle = 0;
    circle1.radius = cr;

    const brush = new Brush();
    brush.color = '#FFFFFF';
    brush.degrees = 0;
    brush.link = true;
    brush.offset = 0;
    brush.point = 0.5;

    circle1.addBrush(brush);

    circ.addShape(circle);
    circ.addShape(circle1);


    engine.import(circ);

    engine.stepFast(stepsToComplete)
        .then(
        _ => {
            runRandom();
        });

}
canvasArea.style.transformOrigin = '0 0'; //scale f2rom top left
canvasArea.style.transform = 'scale(' + window.innerHeight / 1080 + ')';
canvasArea.style.width = 1080 + 'px';
canvasArea.style.height = 1080 + 'px';

canvasArea.querySelectorAll('canvas').forEach(c => {
    c.setAttribute('height', canvasArea.style.height);
    c.setAttribute('width', canvasArea.style.width);
});

runRandom();

