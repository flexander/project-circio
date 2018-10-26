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

        this.canvasArea.classList.add('module', 'painter');

        this.fillBackground();
    }

    fillBackground() {
        this.backgroundContext.beginPath();
        this.backgroundContext.rect(0, 0, this.width, this.height);
        this.backgroundContext.fillStyle = this.getColor(this.backgroundFill);
        this.backgroundContext.fill();
    }

    addCircleBrush (circle, options) {
        let settings = {
            color: (typeof options.color !== 'undefined') ? options.color : this.color,
            point: (typeof options.point !== 'undefined') ? options.point : this.point,
            offset: (typeof options.offset !== 'undefined') ? options.offset : 0,
            degrees: (typeof options.degrees !== 'undefined') ? options.degrees : 0,
            link: (typeof options.link !== 'undefined') ? options.link : false,
        };

        if (typeof this.brushes[circle.id] === 'undefined') {
            this.brushes[circle.id] = [];
        }
        this.brushes[circle.id].push(Object.assign({lastPoint: false}, JSON.parse(JSON.stringify(settings))));
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
        this.fillBackground();
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
        let color = this.getColor((circle.color) ? circle.color: this.color);

        context.fillStyle = color;
        context.strokeStyle = color;
        context.beginPath();
        context.arc(circle.x1, circle.y1, 3, 0, 2*Math.PI);
        context.fill();
    };

    drawPoints (circle) {
        let canvas = this.context;
        let guides = this.guideContext;
        this.brushes[circle.id].forEach(brush => {
            const radians = circle.getRadians();
            const x1 = circle.x0 + (Math.cos(radians) * circle.radius);
            const y1 = circle.y0 + (Math.sin(radians) * circle.radius);
            const x = x1 + (Math.cos(radians + (brush.degrees * (Math.PI/180))) * brush.offset);
            const y = y1 + (Math.sin(radians + (brush.degrees * (Math.PI/180))) * brush.offset);
            const color = this.getColor(brush.color);

            guides.fillStyle = color;

            if (this.showGuide === true) {
                guides.beginPath();
                guides.arc(x, y, 3, 0, 2 * Math.PI);
                guides.fill();

                guides.beginPath();
                guides.moveTo(circle.x1, circle.y1);
                guides.lineTo(x, y);
                guides.stroke();
            }

            if(brush.link === true && brush.lastPoint !== false) {
                canvas.strokeStyle = color;
                canvas.beginPath();
                canvas.moveTo(brush.lastPoint.x, brush.lastPoint.y);
                canvas.lineTo(x, y);
                canvas.stroke();
            } else {
                canvas.fillStyle = color;
                canvas.beginPath();
                canvas.arc(x, y, brush.point, 0, 2*Math.PI);
                canvas.fill();
            }

            brush.lastPoint = {x:x, y:y};
        });
    };

    getColor(color) {
        switch (color) {
            case 'random':
                return this.getRandomColor();
                break;
            default:
                return color;
                break;
        }
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    clear () {
        this.context.clearRect(0,0,this.width, this.height);
    };
}
