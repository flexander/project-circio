import Circ from './modules/circ';
import Engine from './modules/engine';
import Circle from './modules/circle';

const circle0 = new Circle();
circle0.steps = 1000;
circle0.outside = true;
circle0.fixed = true;
circle0.clockwise = true;
circle0.stepMod = 1;
circle0.startAngle = 0;
circle0.radius = 100;

const circ = new Circ();
circ.width = 1080;
circ.height = 1080;
circ.backgroundFill = '#000';



const engine = new Engine();

engine.import(circ);

console.log(circle0.state.drawPoint);
engine.step();
console.log(circle0.state.drawPoint);