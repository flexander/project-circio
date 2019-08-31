import Engine from './modules/engine';
import Painter from "./modules/painter";
import GuidePainter from "./modules/guidePainter";
import {BlueprintStore} from "./modules/storeBlueprint";
import {
    CircControl,
    CircleControl,
    ControlPanel,
    EngineControl,
    GuidePainterControl,
    PainterControl
} from "./modules/controls";
import BackgroundPainter from "./modules/backgroundPainter";

const canvasArea = <HTMLElement>document.querySelector('#circio .painter');
const backgroundCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#background-canvas');
const mainCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#main-canvas');
const guideCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#guide-canvas');
const storage = new BlueprintStore();
const circ = storage.get('twoCircles');

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

    controlPanel.addControl(guidePainterControl);
    controlPanel.addControl(engineControl);
    engineControl.addCircControl(circControl);

    const quickControls = new ControlPanel();
    quickControls.addControls(guidePainterControl.getQuickControls());
    quickControls.addControls(engineControl.getQuickControls());
    quickControls.addControls(painterControl.getQuickControls());

    const controlActionsEl = document.querySelector('.controls-container .actions');
    const controlsEl = document.querySelector('.controls-container .controls');

    controlActionsEl.innerHTML = null;
    controlsEl.innerHTML = null;

    controlActionsEl.appendChild(quickControls.render());
    controlsEl.appendChild(controlPanel.render());
});
engine.import(circ);
engine.play();
