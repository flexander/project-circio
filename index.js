import {Engine, Painter, Controls, Circle} from './scripts/circio.js';

const engine = window.engine = new Engine({
    width: 700,
    height: 700,
    paused: false
});

const painter = window.painter = new Painter(engine, {
    canvasArea: document.querySelector('#circio .painter'),
    backgroundFill: "#fff444",
    showGuide: true,
    color: '#000',
});

const controls = window.controls = new Controls(engine, painter, {
    'actionLocation': document.querySelector('#circio .controls'),
    'controlLocation': document.querySelector('#circio .controls'),
});

const A = new Circle({
    radius: 90,
    direction: 'cw',
});

const D = new Circle({
    radius: 60,
    steps: 4000,
    parent: A,
    position: 'outside',
});

const E = new Circle({
    radius: 30,
    steps: 1000,
    parent: D,
    position: 'outside',
    direction: 'ccw',
    fixed: false,
});

const F = new Circle({
    parent: E,
    radius: 15,
    steps:2
});

engine.addCircles([A, D, E, F]).calculateCircles();

painter.addCircleBrush(F, {offset:30, degrees: 0, color: 'rgba(255,40,2,0.2)', link: true});
//painter.addCircleBrush(E, {offset:30, degrees: 0, color: '#007799', link: false});

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();

