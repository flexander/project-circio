import {EngineFactory} from './modules/engine';
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

const canvasArea = <HTMLElement>document.querySelector('#circio .painter');
const backgroundCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#background-canvas');
const mainCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#main-canvas');
const guideCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#guide-canvas');
const blueprintStorage = new BlueprintStore();
const storageCloud = new CloudStorage();
const storageLocal = new LocalStorage();
const storageBlueprint = new BlueprintStore();
let controlMode = window.localStorage.getItem('config.controlMode') || ControlModes.MODE_DEFAULT;

const renderControls = (circ: CircInterface) => {
    const controlPanel = new ControlPanel('Engine');
    const engineControl = new EngineControl(engine);
    const circControl = new CircControl(circ, controlMode);
    const guidePainterControl = new GuidePainterControl(guidePainter);
    const painterControl = new PainterControl(painter);
    const storageControl = new StorageControl([storageCloud, storageLocal, storageBlueprint], engine);
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
        shape.brushes.forEach((brush: BrushInterface): void => {
            brush.addEventListener('change', (value) => {
                guidePainter.draw(circ);
            });
        });
    })
};


const engine = EngineFactory();
const painter = new Painter(mainCanvasElement.getContext("2d"));
const guidePainter = new GuidePainter(guideCanvasElement.getContext("2d"));
const backgroundPainter = new BackgroundPainter(backgroundCanvasElement.getContext("2d"));

engine.addStepCallback(circ => painter.draw(circ));
engine.addStepCallback(circ => guidePainter.draw(circ));
engine.addResetCallback(_ => painter.clear());
engine.addImportCallback(renderControls);
engine.addImportCallback(initialiseEventListeners);
engine.addImportCallback((circ: CircInterface) => {backgroundPainter.draw(circ)});
engine.play();

blueprintStorage.get('twoCircles')
    .then((circ: CircInterface) => {
        canvasArea.style.transformOrigin = '0 0'; //scale from top left
        canvasArea.style.transform = 'scale(' + window.innerHeight / circ.height + ')';
        canvasArea.style.width = circ.width + 'px';
        canvasArea.style.height = circ.height + 'px';

        canvasArea.querySelectorAll('canvas').forEach(c => {
            c.setAttribute('height', canvasArea.style.height);
            c.setAttribute('width', canvasArea.style.width);
        });

        engine.import(circ);
    });
