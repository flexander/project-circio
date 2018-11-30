import {Engine, Painter, Controls, Zen, Circle, Storage} from './circio.js';

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

const zen = window.zen = new Zen(engine);

const sorage = window.storage = new Storage(engine, painter);

const A = new Circle({
    radius: 60,
    steps: 4,
    radians: Math.PI/2,
    clockwise: false,
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
    outside: true,
    clockwise: false,

});

const D = new Circle({
    radius: 20,
    steps: 500,
    parent: C,

});

engine.addCircles([A, B, C, D]).calculateCircles();

//painter.addCircleBrush(C, {color:'rgba(80,201,12,0.1)', link: true});
painter.addCircleBrush(D, {color:'rgba(255,255,255,0.1)', link: true});

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();
