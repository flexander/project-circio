class Painter {
    constructor (engine, options) {

        if(typeof engine === "undefined") {
            throw "Please create an engine";
        }

        // Engine
        this.engine = engine;
        this.width = this.engine.width;
        this.height = this.engine.height;

        this.showGuide = options.showGuide;
        this.canvasArea = options.canvasArea;

        this.draw = (typeof options.draw !== 'undefined') ? options.draw : true;
        this.color = (typeof options.color !== 'undefined') ? options.color : '#FFF';
        this.background = (typeof options.background !== 'undefined') ? options.background : '#050490';

        this.canvasArea.css({
            'background':this.background,
            'width': this.width,
            'height': this.height,
        });

        this.canvas = $('<canvas id="main-canvas">');
        this.canvasArea.append(this.canvas);
        this.context = $(this.canvas)[0].getContext("2d");

        this.guide = $('<canvas id="guide-canvas">');
        this.canvasArea.append(this.guide);
        this.guideContext = $(this.guide)[0].getContext("2d");

        this.canvasArea.find('canvas').each(function(i, c) {
            $(c).attr({
                'height': this.canvasArea.height(),
                'width': this.canvasArea.width(),
            }).css({
                'position': 'absolute',
            });
        }.bind(this));
    }

    drawCircle (circle) {
        let context = this.guideContext;
        let color = (circle.color) ? circle.color: this.color;

        context.strokeStyle = color;
        context.beginPath();
        context.arc(circle.x0,circle.y0,circle.radius,0,2*Math.PI);
        context.stroke();

        this.drawRotation(circle);
    };

    drawCircles () {
        this.guideContext.clearRect(0,0,this.width, this.height);

        this.engine.list.forEach(function(circle) {
            if(this.showGuide === true) {
                this.drawCircle(circle);
            }
            if(this.draw === true && circle.draw === true) {
                this.drawPoint(circle);
            }
        }.bind(this));
    }

    drawRotation (circle) {
        let context = this.guideContext;
        let color = (circle.color) ? circle.color: this.color;

        context.fillStyle = color;
        context.strokeStyle = color;
        context.beginPath();
        context.arc(circle.x1, circle.y1, 3, 0, 2*Math.PI);
        context.fill();
    };

    drawPoint (circle) {
        let context = this.context;
        let color = (circle.color) ? circle.color: this.color;
        let point = circle.point ? circle.point: '0.5';

        context.fillStyle = color;
        context.beginPath();
        context.arc(circle.x1, circle.y1, point, 0, 2*Math.PI);
        context.fill();
    };

    clear () {
        this.context.clearRect(0,0,this.width, this.height);
    };

    showActions () {
        let actionContainer = $('<div class="actions">');
        let showGuides = $('<button class="show-guides">Guides</button>');
        let paused = $('<button class="paused">Pause</button>');
        let clear = $('<button class="clear">Clear</button>');

        if(this.engine.paused) {
            paused.innerHTML = 'play';
        } else {
            paused.innerHTML = 'pause';
        }

        actionContainer.append(showGuides);
        actionContainer.append(paused);
        actionContainer.append(clear);
        this.canvasArea.prepend(actionContainer);

        // Toggle show guides state
        showGuides.on('click', function(){
            this.showGuide = this.showGuide === false;
            return;
        }.bind(this));

        // Toggle pause state
        paused.on('click', function(e){
            this.engine.paused = this.engine.paused === false;
            if(this.engine.paused) {
                e.target.innerHTML = 'Play';
            } else {
                e.target.innerHTML = 'Pause';
            }
            return;
        }.bind(this));

        // clear canvas
        clear.on('click', function(){
            this.clear();
            return;
        }.bind(this));
    }
}