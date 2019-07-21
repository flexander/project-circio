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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0aHJlZUNpcmNsZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVuZ2luZSBmcm9tICcuLi9tb2R1bGVzL2VuZ2luZSc7XG5pbXBvcnQgUGFpbnRlciBmcm9tICcuLi9tb2R1bGVzL3BhaW50ZXInO1xuaW1wb3J0IENvbnRyb2xzIGZyb20gJy4uL21vZHVsZXMvY29udHJvbHMnO1xuaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi4vbW9kdWxlcy9zdG9yYWdlJztcbmltcG9ydCBCbHVlcHJpbnRzIGZyb20gJy4uL21vZHVsZXMvYmx1ZXByaW50cyc7XG5cbmNvbnN0IGVuZ2luZSA9IHdpbmRvdy5lbmdpbmUgPSBuZXcgRW5naW5lKHtcbiAgICB3aWR0aDogOTAwLFxuICAgIGhlaWdodDogOTAwLFxuICAgIHBhdXNlZDogZmFsc2UsXG4gICAgaW50ZXJ2YWw6IDFcbn0pO1xuXG5jb25zdCBwYWludGVyID0gd2luZG93LnBhaW50ZXIgPSBuZXcgUGFpbnRlcihlbmdpbmUsIHtcbiAgICBjYW52YXNBcmVhOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2lyY2lvIC5wYWludGVyJyksXG4gICAgYmFja2dyb3VuZEZpbGw6IFwiIzAwMDAwMFwiLFxuICAgIHNob3dHdWlkZTogdHJ1ZSxcbiAgICBjb2xvcjogJyNmZmZmZmYnLFxufSk7XG5cbmNvbnN0IGNvbnRyb2xzID0gd2luZG93LmNvbnRyb2xzID0gbmV3IENvbnRyb2xzKGVuZ2luZSwgcGFpbnRlciwge1xuICAgICdhY3Rpb25Mb2NhdGlvbic6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXJjaW8gLmNvbnRyb2xzJyksXG4gICAgJ2NvbnRyb2xMb2NhdGlvbic6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXJjaW8gLmNvbnRyb2xzJyksXG59KTtcblxuY29uc3Qgc3RvcmFnZSA9IHdpbmRvdy5zdG9yYWdlID0gbmV3IFN0b3JhZ2UoZW5naW5lLCBwYWludGVyLCBjb250cm9scyk7XG5jb25zdCBibHVlcHJpbnRzID0gd2luZG93LmJsdWVwcmludHMgPSBuZXcgQmx1ZXByaW50cyhzdG9yYWdlKTtcblxuY29udHJvbHMuc2hvd0FjdGlvbnMoKS5zaG93Q29udHJvbHMoKTtcbmVuZ2luZS5hZGRDYWxsYmFjayhwYWludGVyLmRyYXdDaXJjbGVzLmJpbmQocGFpbnRlcikpO1xuZW5naW5lLnJ1bigpO1xuXG5ibHVlcHJpbnRzLmxvYWQoJ3RocmVlQ2lyY2xlcycpO1xuIl0sImZpbGUiOiJ0aHJlZUNpcmNsZXMuanMifQ==
