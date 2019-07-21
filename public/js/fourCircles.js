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

blueprints.load('fourCircles');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VyQ2lyY2xlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRW5naW5lIGZyb20gJy4uL21vZHVsZXMvZW5naW5lJztcbmltcG9ydCBQYWludGVyIGZyb20gJy4uL21vZHVsZXMvcGFpbnRlcic7XG5pbXBvcnQgQ29udHJvbHMgZnJvbSAnLi4vbW9kdWxlcy9jb250cm9scyc7XG5pbXBvcnQgU3RvcmFnZSBmcm9tICcuLi9tb2R1bGVzL3N0b3JhZ2UnO1xuaW1wb3J0IEJsdWVwcmludHMgZnJvbSAnLi4vbW9kdWxlcy9ibHVlcHJpbnRzJztcblxuY29uc3QgZW5naW5lID0gd2luZG93LmVuZ2luZSA9IG5ldyBFbmdpbmUoe1xuICAgIHdpZHRoOiA5MDAsXG4gICAgaGVpZ2h0OiA5MDAsXG4gICAgcGF1c2VkOiBmYWxzZSxcbiAgICBpbnRlcnZhbDogMVxufSk7XG5cbmNvbnN0IHBhaW50ZXIgPSB3aW5kb3cucGFpbnRlciA9IG5ldyBQYWludGVyKGVuZ2luZSwge1xuICAgIGNhbnZhc0FyZWE6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXJjaW8gLnBhaW50ZXInKSxcbiAgICBiYWNrZ3JvdW5kRmlsbDogXCIjMDAwMDAwXCIsXG4gICAgc2hvd0d1aWRlOiB0cnVlLFxuICAgIGNvbG9yOiAnI2ZmZmZmZicsXG59KTtcblxuY29uc3QgY29udHJvbHMgPSB3aW5kb3cuY29udHJvbHMgPSBuZXcgQ29udHJvbHMoZW5naW5lLCBwYWludGVyLCB7XG4gICAgJ2FjdGlvbkxvY2F0aW9uJzogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NpcmNpbyAuY29udHJvbHMnKSxcbiAgICAnY29udHJvbExvY2F0aW9uJzogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NpcmNpbyAuY29udHJvbHMnKSxcbn0pO1xuXG5jb25zdCBzdG9yYWdlID0gd2luZG93LnN0b3JhZ2UgPSBuZXcgU3RvcmFnZShlbmdpbmUsIHBhaW50ZXIsIGNvbnRyb2xzKTtcbmNvbnN0IGJsdWVwcmludHMgPSB3aW5kb3cuYmx1ZXByaW50cyA9IG5ldyBCbHVlcHJpbnRzKHN0b3JhZ2UpO1xuXG5jb250cm9scy5zaG93QWN0aW9ucygpLnNob3dDb250cm9scygpO1xuZW5naW5lLmFkZENhbGxiYWNrKHBhaW50ZXIuZHJhd0NpcmNsZXMuYmluZChwYWludGVyKSk7XG5lbmdpbmUucnVuKCk7XG5cbmJsdWVwcmludHMubG9hZCgnZm91ckNpcmNsZXMnKTtcbiJdLCJmaWxlIjoiZm91ckNpcmNsZXMuanMifQ==
