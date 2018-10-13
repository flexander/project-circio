export default class Painter {
    constructor (engine, options) {

        if (typeof engine === "undefined") {
            throw "Please create an engine";
        }

        // Engine
        this.engine = engine;
        this.width = this.engine.width;
        this.height = this.engine.height;

        this.showGuide = options.showGuide;
        this.canvasArea = options.canvasArea;

        this.brushes = [];

        this.draw = (typeof options.draw !== 'undefined') ? options.draw : true;
        this.color = (typeof options.color !== 'undefined') ? options.color : '#FFF';
        this.point = (typeof options.point !== 'undefined') ? options.point : 0.5;
        this.backgroundFill = (typeof options.backgroundFill !== 'undefined') ? options.backgroundFill : '#050490';

        this.canvasArea.style.background = this.background;
        this.canvasArea.style.width = this.width + 'px';
        this.canvasArea.style.height = this.height + 'px';

        this.background = document.createElement('canvas');
        this.background.setAttribute('id', 'background-canvas');
        this.canvasArea.appendChild(this.background);
        this.backgroundContext = this.background.getContext("2d");

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'main-canvas');
        this.canvasArea.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");

        this.guide = document.createElement('canvas');
        this.guide.setAttribute('id', 'guide-canvas');
        this.canvasArea.appendChild(this.guide);
        this.guideContext = this.guide.getContext("2d");

        this.canvasArea.querySelectorAll('canvas').forEach(c => {
            c.setAttribute('height', this.canvasArea.style.height);
            c.setAttribute('width', this.canvasArea.style.width);
            c.style.position = 'absolute';
        });

        this.backgroundContext.beginPath();
        this.backgroundContext.rect(0, 0, this.width, this.height);
        this.backgroundContext.fillStyle = this.backgroundFill;
        this.backgroundContext.fill();
    }

    addCircleBrush (circle, options) {
        let settings = {
            color: (typeof options.color !== 'undefined') ? options.color : this.color,
            point: (typeof options.point !== 'undefined') ? options.point : this.point,
            offset: (typeof options.offset !== 'undefined') ? options.offset : 0,
        };

        if (typeof this.brushes[circle.id] === 'undefined') {
            this.brushes[circle.id] = [];
        }
        this.brushes[circle.id].push(settings);
    }

    drawCircle (circle) {
        let context = this.guideContext;
        let color = (circle.color) ? circle.color: this.color;

        context.strokeStyle = color;
        context.beginPath();
        context.arc(circle.x0,circle.y0,circle.radius,0,2*Math.PI);
        context.stroke();

        this.drawCircleRotation(circle);
    };

    drawCircles () {
        this.guideContext.clearRect(0,0,this.width, this.height);

        this.engine.list.forEach(circle => {
            if (this.showGuide === true) {
                this.drawCircle(circle);
            }

            if (typeof this.brushes[circle.id] !== 'undefined' && this.brushes[circle.id].length > 0) {
                this.drawPoints(circle);
            }
        });
        return this;
    }

    drawCircleRotation (circle) {
        let context = this.guideContext;
        let color = (circle.color) ? circle.color: this.color;

        context.fillStyle = color;
        context.strokeStyle = color;
        context.beginPath();
        context.arc(circle.x1, circle.y1, 3, 0, 2*Math.PI);
        context.fill();
    };

    drawPoints (circle) {
        let context = this.context;
        this.brushes[circle.id].forEach(brush => {
            context.fillStyle = brush.color;
            context.beginPath();
            context.arc(circle.x1, circle.y1, brush.point, 0, 2*Math.PI);
            context.fill();
        });
    };

    clear () {
        this.context.clearRect(0,0,this.width, this.height);
    };

    showActions () {
        let actionContainer = document.createElement('div');
        actionContainer.classList.add('actions');

        let showGuides = document.createElement('button');
        showGuides.classList.add('show-guides');
        showGuides.textContent = 'Guides';

        let paused = document.createElement('button');
        paused.classList.add('paused');
        paused.textContent = 'Pause';

        let clear = document.createElement('button');
        clear.classList.add('clear');
        clear.textContent = 'Clear';

        if (this.engine.paused) {
            paused.innerHTML = 'play';
        } else {
            paused.innerHTML = 'pause';
        }

        actionContainer.append(showGuides);
        actionContainer.append(paused);
        actionContainer.append(clear);
        this.canvasArea.prepend(actionContainer);

        // Toggle show guides state
        showGuides.addEventListener('click', () => {
            this.showGuide = this.showGuide === false;
            return;
        });

        // Toggle pause state
        paused.addEventListener('click', e => {
            this.engine.paused = this.engine.paused === false;
            if (this.engine.paused) {
                e.target.innerHTML = 'Play';
            } else {
                e.target.innerHTML = 'Pause';
            }
            return;
        });

        // clear canvas
        clear.addEventListener('click', () => {
            this.clear();
            return;
        });
    }
}
