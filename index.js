import {Engine, Painter, Controls, Circle} from './scripts/circio.js';

const engine = window.engine = new Engine({
    width: 700,
    height: 700,
    paused: false
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

const A = new Circle({
    radius: 100,
    direction: 'cw',
    //steps: 2000,
});

const B = new Circle({
    radius: 40,
    steps: 4000,
    parent: A,
    //position: 'outside',
});

const C = new Circle({
    radius: 20,
    steps: 500,
    parent: B,
    position: 'outside',
    direction: 'ccw'
});

engine.addCircles([A, B, C]).calculateCircles();

painter.addCircleBrush(C, {offset:-50, color:'#f99f00'});

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();

