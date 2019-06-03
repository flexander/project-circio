import {Engine, Painter, Controls, Zen, Circle, Storage} from './circio.js';

const engine = window.engine = new Engine({
    width: 700,
    height: 700,
    paused: false,
    interval: 100
});

const painter = window.painter = new Painter(engine, {
    canvasArea: document.querySelector('#circio .painter'),
    backgroundFill: "#000000",
    showGuide: true,
    color: '#ffffff',
});

const controls = window.controls = new Controls(engine, painter, {
    'actionLocation': document.querySelector('#circio .controls'),
    'controlLocation': document.querySelector('#circio .controls'),
});

const zen = window.zen = new Zen(engine);

const sorage = window.storage = new Storage(engine, painter);

const A = new Circle({
    radius: 60,
    steps: 556,
    radians: Math.PI/2,
    clockwise: false,
});

const B = new Circle({
    radius: 40,
    steps: 556,
    parent: A,
    outside: true,
});

const C = new Circle({
    radius: 20,
    steps: 500,
    parent: B,
    outside: true,
    clockwise: false,
});

const D = new Circle({
    radius: 20,
    steps: 500,
    parent: C,
    outside: true,
});

const E = new Circle({
    radius: 20,
    steps: 500,
    parent: D,
    outside: true,
    clockwise: false,
});

engine.addCircles([A, B, C, D, E]).calculateCircles();

painter.addCircleBrush(D, {color:'#ff98eb', offset: 0});
// painter.addCircleBrush(C, {color:'#ff98eb', offset: -10});
// painter.addCircleBrush(C, {color:'#ff98eb', offset: 0});
// painter.addCircleBrush(C, {color:'#ff98eb', offset: 10});
// painter.addCircleBrush(D, {color:'#88e6ff', offset: -10});
// painter.addCircleBrush(D, {color:'#88e6ff', offset: 0});
// painter.addCircleBrush(D, {color:'#88e6ff', offset: 10});
// painter.addCircleBrush(E, {color:'#98ff9a', offset: -10});
// painter.addCircleBrush(E, {color:'#98ff9a', offset: 0});
// painter.addCircleBrush(E, {color:'#98ff9a', offset: 10});

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();
