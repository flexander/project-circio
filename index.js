import {Engine, Painter, Controls, Circle} from './scripts/circio.js';

document.addEventListener("DOMContentLoaded", function() {

    const engine = window.engine = new Engine({
        width: 700,
        height: 700,
        paused: false
    });

    const painter = window.painter = new Painter(engine, {
        canvasArea: document.querySelector('#canvas-area'),
        backgroundFill: "#000",
        showGuide: true,
    });

    const controls = window.controls = new Controls(engine, painter, {});

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

    painter.addCircleBrush(C, {offset:0, color:'#0099ff'});
    painter.addCircleBrush(C, {offset:-110, color:'#9900ff'});
    painter.addCircleBrush(C, {offset:-80, color:'#99ff00'});
    painter.addCircleBrush(C, {offset:-50, color:'#f99f00'});

    controls.showActions();
    engine.addCallback(painter.drawCircles.bind(painter));
    engine.run();
});
