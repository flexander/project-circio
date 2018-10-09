document.addEventListener("DOMContentLoaded", function() {

    const engine = new Engine({
        width: 700,
        height: 700,
        paused: false
    });

    const painter = new Painter(engine, {
        canvasArea: $('#canvas-area'),
        background: "#000",
        showGuide: true,
        draw: true,
    });

    engine.addCallback(painter.drawCircles.bind(painter));

    A = {
        radius: 80,
        steps: 1000,
    };

    B = {
        parent: A,
        radius: 80,
        position: 'outside',
        steps: 900,
        direction: 'ccw',
    }

    C = {
        parent: B,
        radius: 40,
        steps: 100,
        draw: true,
        color: 'red'
    }

    engine.addCircles([
        A,
        B,
        C,
    ]);

    painter.showActions();
    engine.run();
});