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

    engine.addCallback(painter.drawCircles.bind(painter));

    A = {
        radius: 80,
        direction: 'cw',
        //steps: 0,
    };

    B = {
        parent: A,
        radius: 40,
        position: 'outside',
        //direction: 'ccw',
        //steps: 0
    }

    engine.addCircles([
        A,
        B,
    ]).calculateCircles();

    painter.drawCircles().showActions();
    engine.run();
});