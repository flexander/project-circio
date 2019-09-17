import Engine from './modules/engine';
import Painter from "./modules/painter";
import GuidePainter from "./modules/guidePainter";
import {BlueprintStore} from "./modules/storeBlueprint";
import BackgroundPainter from "./modules/backgroundPainter";
import LocalStorage from "./modules/storeLocal";
import ControlPanel from "./modules/controls/panel";
import EngineControl from "./modules/controls/engine";
import CircControl from "./modules/controls/circ";
import GuidePainterControl from "./modules/controls/guidePainter";
import PainterControl from "./modules/controls/painter";
import StorageControl from "./modules/controls/storage";
import Circ from "./modules/circ";
import {Circle} from "./modules/circle";
import {Polygon} from "./modules/polygon";
import Brush from "./modules/brushes";

const canvasArea = <HTMLElement>document.querySelector('#circio .painter');
const backgroundCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#background-canvas');
const mainCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#main-canvas');
const guideCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#guide-canvas');
const blueprintStorage = new BlueprintStore();
const storage = new LocalStorage();
// const circ = blueprintStorage.get('twoCircles');


const circ = new Circ();
circ.width = 1080;
circ.height = 1080;
circ.backgroundFill = '#1b5eec';

const polygon0 = new Polygon();
polygon0.steps = 0;
polygon0.outside = false;
polygon0.fixed = true;
polygon0.clockwise = false;
polygon0.stepMod = 0;
polygon0.startAngle = 0;
polygon0.radius = 300;
polygon0.faces = 5;

const polygon1 = new Polygon();
polygon1.steps = 500;
polygon1.outside = true;
polygon1.fixed = true;
polygon1.clockwise = true;
polygon1.stepMod = 0;
polygon1.startAngle = 0;
polygon1.radius = 25;
polygon1.faces = 5;

const polygon1Brush = new Brush();
polygon1Brush.color = '#FFFFFF';
polygon1Brush.degrees = 0;
polygon1Brush.link = false;
polygon1Brush.offset = 0;
polygon1Brush.point = 0.5;

const polygon1CentreBrush = new Brush();
polygon1CentreBrush.color = '#000000';
polygon1CentreBrush.degrees = 0;
polygon1CentreBrush.link = false;
polygon1CentreBrush.offset = -polygon1.radius;
polygon1CentreBrush.point = 0.5;

polygon1.brushes.push(polygon1Brush);
polygon1.brushes.push(polygon1CentreBrush);

circ.addShape(polygon0);
circ.addShape(polygon1);

canvasArea.style.transformOrigin = '0 0'; //scale from top left
canvasArea.style.transform = 'scale(' + window.innerHeight / circ.height + ')';
canvasArea.style.width = circ.width + 'px';
canvasArea.style.height = circ.height + 'px';

canvasArea.querySelectorAll('canvas').forEach(c => {
    c.setAttribute('height', canvasArea.style.height);
    c.setAttribute('width', canvasArea.style.width);
});

const engine = new Engine();
const painter = new Painter(mainCanvasElement.getContext("2d"));
const guidePainter = new GuidePainter(guideCanvasElement.getContext("2d"));
const backgroundPainter = new BackgroundPainter(backgroundCanvasElement.getContext("2d"));

engine.addStepCallback(circ => painter.draw(circ));
engine.addStepCallback(circ => guidePainter.draw(circ));
engine.addStepCallback(circ => backgroundPainter.draw(circ));
engine.addResetCallback(_ => painter.clear());
engine.addImportCallback(circ => {
    const controlPanel = new ControlPanel('Engine');
    const engineControl = new EngineControl(engine);
    const circControl = new CircControl(circ);
    const guidePainterControl = new GuidePainterControl(guidePainter);
    const painterControl = new PainterControl(painter);
    const storageControl = new StorageControl(storage, engine);

    controlPanel.addControl(guidePainterControl);
    controlPanel.addControl(engineControl);
    engineControl.addCircControl(circControl);

    const quickControls = new ControlPanel();
    quickControls.addControls(guidePainterControl.getQuickControls());
    quickControls.addControls(engineControl.getQuickControls());
    quickControls.addControls(painterControl.getQuickControls());
    quickControls.addControls(painterControl.getQuickControls());
    quickControls.addControls(storageControl.getQuickControls());

    const controlActionsEl = document.querySelector('.controls-container .actions');
    const controlsEl = document.querySelector('.controls-container .controls');

    controlActionsEl.innerHTML = null;
    controlsEl.innerHTML = null;

    controlActionsEl.appendChild(quickControls.render());
    controlsEl.appendChild(controlPanel.render());
});
engine.import(circ);
engine.play();
