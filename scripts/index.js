import {Engine, Painter, Controls, Zen, Circle} from './circio.js';

const engine = window.engine = new Engine({
    width: 700,
    height: 700,
    paused: true
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

const A = new Circle({
    radius: 60,
    direction: 'cw',
    steps: 500,
    radians: Math.PI/2
});

const B = new Circle({
    radius: 40,
    steps: 500,
    parent: A,
    outside: true,
});

const C = new Circle({
    radius: 20,
    steps: 500,
    parent: B,

});

const D = new Circle({
    radius: 20,
    steps: 500,
    parent: C,

});

engine.addCircles([A, B, C, D]).calculateCircles();

painter.addCircleBrush(D, {color:'#719cf9'});

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();
