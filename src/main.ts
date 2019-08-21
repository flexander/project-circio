import Circ from './modules/circ';
import Engine from './modules/engine';
import Circle from './modules/circle';
import Painter from "./modules/painter";
import Brush from "./modules/brushes";
import GuidePainter from "./modules/guidePainter";

const circle0 = new Circle();
circle0.steps = 1000;
circle0.outside = true;
circle0.fixed = true;
circle0.clockwise = true;
circle0.stepMod = 1;
circle0.startAngle = 0;
circle0.radius = 100;
circle0.state.centre.x = 1080/2;
circle0.state.centre.y = 1080/2;

const circle1 = new Circle();
circle1.steps = 500;
circle1.outside = true;
circle1.fixed = true;
circle1.clockwise = true;
circle1.stepMod = 1;
circle1.startAngle = 0;
circle1.radius = 100;

const circle1Brush = new Brush();
circle1Brush.color = '#FFFFFF';
circle1Brush.degrees = 0;
circle1Brush.link = false;
circle1Brush.offset = 0;
circle1Brush.point = 1;

circle1.brushes.push(circle1Brush);

const circ = new Circ();
circ.width = 1080;
circ.height = 1080;
circ.backgroundFill = '#000000';
circ.shapes.push(circle0);
circ.shapes.push(circle1);


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
backgroundContext.fillStyle = '#000000';
backgroundContext.fill();



const engine = new Engine();
const painter = new Painter(canvasContext);
const guidePainter = new GuidePainter(guideContext);
engine.import(circ);
engine.addCallback(circ => painter.draw(circ));
engine.addCallback(circ => guidePainter.draw(circ));

engine.play();
