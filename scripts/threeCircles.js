import Engine from '../modules/engine';
import Painter from '../modules/painter';
import Controls from '../modules/controls';
import Storage from '../modules/storage';
import Blueprints from '../modules/blueprints';

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

const storage = window.storage = new Storage(engine, painter, controls);
const blueprints = window.blueprints = new Blueprints(storage);

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();

blueprints.load('threeCircles');
