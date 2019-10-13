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

const canvasArea = <HTMLElement>document.querySelector('#circio .painter');
const backgroundCanvasElement = <HTMLCanvasElement>document.querySelector('#background-canvas');
const mainCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#main-canvas');
const guideCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#guide-canvas');
const blueprintStorage = new BlueprintStore();
const storageCloud = new CloudStorage();
const storageLocal = new LocalStorage();
const storageBlueprint = new BlueprintStore();
const storageRandom = new StoreRandom();
let controlMode = window.localStorage.getItem('config.controlMode') || ControlModes.MODE_DEFAULT;
let resizeDebounce;

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

const transformCanvas = (circ: CircInterface) => {
    const scaleFactor = Math.min(window.innerHeight,window.innerWidth-300) / Math.min(circ.height,circ.width);
    canvasArea.style.transform = 'scale(' + Math.min(scaleFactor, 1) + ')';

    if (circ.width !== parseInt(canvasArea.style.width, 10) || circ.height !== parseInt(canvasArea.style.height, 10)) {
        canvasArea.style.transformOrigin = `${circ.width/2} ${circ.height/2}`;
        canvasArea.style.width = circ.width + 'px';
        canvasArea.style.height = circ.height + 'px';
        canvasArea.style.position = `absolute`;
        canvasArea.style.left = `calc(50% - ${circ.width/2}px - (300px / 2) )`;
        canvasArea.style.top = `calc(50% - ${circ.height/2}px)`;

        canvasArea.querySelectorAll('canvas').forEach(c => {
            c.setAttribute('height', '' + circ.height);
            c.setAttribute('width', '' + circ.width);
        });
    }
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
engine.addImportCallback(transformCanvas);
engine.addImportCallback((circ: CircInterface) => {backgroundPainter.draw(circ)});
engine.addImportCallback((circ: CircInterface) => {
    window.addEventListener('resize', e => {
        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(_ => transformCanvas(circ), 50);
    });
});

storageRandom.get()
    .then((circ: CircInterface) => {
        engine.import(circ);
        engine.stepFast(circ.stepsToComplete);
    });
