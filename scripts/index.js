import {Engine, Painter, Controls, Zen, Circle, Storage} from './circio.js';

const engine = window.engine = new Engine({
    width: 900,
    height: 900,
    paused: false,
    interval: 1
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

const sorage = window.storage = new Storage(engine, painter, controls);

const A = new Circle({
    radius: 60,
    steps: 556,
    radians: Math.PI/2,
    clockwise: false,
});

const B = new Circle({
    radius: 40,
    steps: 556,
    outside: true,
});

const C = new Circle({
    radius: 20,
    steps: 500,
    outside: true,
    clockwise: false,
});

const D = new Circle({
    radius: 20,
    steps: 500,
    outside: true,
});

const E = new Circle({
    radius: 20,
    steps: 500,
    outside: true,
    clockwise: false,
});

const F = new Circle({
    radius: 20,
    steps: 500,
    outside: true,
    clockwise: false,
});

engine.addCircles([A, B, C]).calculateCircles();

painter.addCircleBrush(C, {color:'#ff98eb', offset: 0});

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();
