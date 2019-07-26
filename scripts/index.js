import Engine from '../modules/engine';
import Painter from '../modules/painter';
import Controls from '../modules/controls';
import Storage from '../modules/storage';
import Blueprints from '../modules/blueprints';

const engine = window.engine = new Engine({
    paused: false,
    interval: 2,
    height: 1080,
    width: 1080,
});

const painter = window.painter = new Painter(engine, {
    canvasArea: document.querySelector('#circio .painter'),
    backgroundFill: "#000000",
    showGuide: true,
    color: '#ffffff',
});

const controls = window.controls = new Controls(engine, painter, {
    'actionLocation': document.querySelector('#circio .controls-container'),
    'controlLocation': document.querySelector('#circio .controls-container'),
});

const storage = window.storage = new Storage(engine, painter, controls);
const blueprints = window.blueprints = new Blueprints(storage);

controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();

blueprints.load('fourCircles');
