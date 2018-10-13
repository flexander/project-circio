import * as Circio from './scripts/circio.js';

document.addEventListener("DOMContentLoaded", function() {

    const engine = new Circio.Engine({
        width: 700,
        height: 700,
        paused: false
    });

    window.engine = engine;

    const painter = new Circio.Painter(engine, {
        canvasArea: document.querySelector('#canvas-area'),
        background: "#000",
        showGuide: true,
        draw: true,
    });

    engine.addCallback(painter.drawCircles.bind(painter));

    let A = {
        radius: 100,
        direction: 'cw',
        steps: 2000,
    };

    let B = {
        parent: A,
        radius: 40,
        steps: 2000,
    };

    let C = {
        parent: B,
        radius: 20,
        steps: 200,
        pointOffset: 30,
        draw: true,
        color: '#0044ff'
    }

    engine.addCircles([
        A,
        B,
        C,
    ]).calculateCircles();

    painter.drawCircles().showActions();
    engine.run();
});
