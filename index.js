import {Engine, Painter, Circle} from './scripts/circio.js';

document.addEventListener("DOMContentLoaded", function() {

    const engine = new Engine({
        width: 700,
        height: 700,
        paused: false
    });

    window.engine = engine;

    const painter = new Painter(engine, {
        canvasArea: document.querySelector('#canvas-area'),
        background: "#000",
        showGuide: true,
        draw: true,
    });

    const A = new Circle({
        radius: 100,
        direction: 'cw',
        steps: 2000,
    });

    const B = new Circle({
        radius: 40,
        steps: 2000,
        parent: A
    });

    const C = new Circle({
        radius: 20,
        steps: 200,
        draw: true,
        color: '#0044ff',
        parent: B
    });

    engine.addCircles([
        A,
        B,
        C,
    ]).calculateCircles();

    painter.drawCircles().showActions();

    engine.addCallback(painter.drawCircles.bind(painter));
    engine.run();
});
