import Engine from './modules/engine';
import Painter from "./modules/painter";
import GuidePainter from "./modules/guidePainter";
import {BlueprintStore} from "./modules/storeBlueprint";

const storage = new BlueprintStore();

const circ = storage.get('threeCircles');

const canvasArea = document.querySelector('#circio .painter');
canvasArea.style.transformOrigin = '0 0'; //scale from top left
canvasArea.style.transform = 'scale(' + window.innerHeight / circ.height + ')';
canvasArea.style.width = circ.width + 'px';
canvasArea.style.height = circ.height + 'px';

const background = document.createElement('canvas');
background.setAttribute('id', 'background-canvas');
canvasArea.appendChild(background);

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'main-canvas');
canvasArea.appendChild(canvas);
const canvasContext = canvas.getContext("2d");

const guide = document.createElement('canvas');
guide.setAttribute('id', 'guide-canvas');
canvasArea.appendChild(guide);
const guideContext = guide.getContext("2d");

canvasArea.querySelectorAll('canvas').forEach(c => {
    c.setAttribute('height', canvasArea.style.height);
    c.setAttribute('width', canvasArea.style.width);
    c.style.position = 'absolute';
});


const backgroundContext = background.getContext("2d");
backgroundContext.beginPath();
backgroundContext.rect(0, 0, circ.width, circ.height);
backgroundContext.fillStyle = circ.backgroundFill;
backgroundContext.fill();

const engine = new Engine();
const painter = new Painter(canvasContext);
const guidePainter = new GuidePainter(guideContext);
engine.import(circ);
engine.addCallback(circ => painter.draw(circ));
engine.addCallback(circ => guidePainter.draw(circ));

engine.play();

