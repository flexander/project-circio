import Engine from './local_modules/engine';
import Painter from './local_modules/painter';
import Controls from './local_modules/controls';
import Zen from './local_modules/zen';
import Storage from './local_modules/storage';
import Blueprints from './local_modules/blueprints';

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
const blueprints = window.blueprints = new Blueprints(storage);

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();

blueprints.load('threeCircles');
