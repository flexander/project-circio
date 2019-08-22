import Engine from './modules/engine';
import Painter from "./modules/painter";
import GuidePainter from "./modules/guidePainter";
import {BlueprintStore} from "./modules/storeBlueprint";
import {CircControl, CircleControl, ControlPanel, EngineControl} from "./modules/controls";

const canvasArea = <HTMLElement>document.querySelector('#circio .painter');
const backgroundCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#background-canvas');
const mainCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#main-canvas');
const guideCanvasElement = <HTMLCanvasElement>canvasArea.querySelector('#guide-canvas');
const storage = new BlueprintStore();
const circ = storage.get('threeCircles');

canvasArea.style.transformOrigin = '0 0'; //scale from top left
canvasArea.style.transform = 'scale(' + window.innerHeight / circ.height + ')';
canvasArea.style.width = circ.width + 'px';
canvasArea.style.height = circ.height + 'px';

canvasArea.querySelectorAll('canvas').forEach(c => {
    c.setAttribute('height', canvasArea.style.height);
    c.setAttribute('width', canvasArea.style.width);
});


const backgroundCanvasContext = backgroundCanvasElement.getContext("2d");
backgroundCanvasContext.fillStyle = circ.backgroundFill;
backgroundCanvasContext.fillRect(0, 0, circ.width, circ.height);

const engine = new Engine();
const painter = new Painter(mainCanvasElement.getContext("2d"));
const guidePainter = new GuidePainter(guideCanvasElement.getContext("2d"));

engine.import(circ);
engine.addCallback(circ => painter.draw(circ));
engine.addCallback(circ => guidePainter.draw(circ));
engine.play();

const controlPanel = new ControlPanel();
const engineControl = new EngineControl(engine);
const circControl = new CircControl(circ);

controlPanel.addControl(engineControl);
engineControl.addCircControl(circControl);

document.querySelector('.controls-container').appendChild(controlPanel.render());
