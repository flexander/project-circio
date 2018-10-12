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
        radius: 40,
        direction: 'cw',
        steps: 2000,
        y0: 150
    };

    B = {
        parent: A,
        radius: 40,
        position: 'outside',
        //direction: 'ccw',
        //steps: 2000,
        pointOffset: 20
    };

    C = {
        parent: B,
        radius: 40,
        position: 'outside',
        //direction: 'ccw',
        //steps: 2000,
        pointOffset: 40
    }

    engine.addCircles([
        A,
        B,
        C,
    ]).calculateCircles();

    painter.drawCircles().showActions();
    engine.run();
});
