export default class Controls {
    constructor (engine, painter, options) {
        if (typeof engine === "undefined") {
            throw "Please create an engine";
        }

        if (typeof painter === "undefined") {
            throw "Please create a painter";
        }

        this.engine = engine;
        this.painter = painter;
        this.actionLocation = (typeof options.actionLocation !== 'undefined') ? options.actionLocation: document.querySelector('#circio');
        this.controlLocation = (typeof options.controlLocation !== 'undefined') ? options.controlLocation: document.querySelector('#circio');

        this.controlsConfig = {
            'brushControls': {
                color: {
                    type: 'text'
                }
            }
        };
    }

    showActions () {
        let actionContainer = document.createElement('div');
        actionContainer.classList.add('module', 'actions');

        let showGuides = document.createElement('button');
        showGuides.classList.add('show-guides');
        showGuides.textContent = 'Guides';

        let paused = document.createElement('button');
        paused.classList.add('paused');
        paused.textContent = 'Pause';

        let clear = document.createElement('button');
        clear.classList.add('clear');
        clear.textContent = 'Clear';

        let stepThousand = document.createElement('button');
        stepThousand.classList.add('stepThousand');
        stepThousand.textContent = 'Step 1000';

        if (this.engine.paused) {
            paused.innerHTML = 'play';
        } else {
            paused.innerHTML = 'pause';
        }

        actionContainer.append(showGuides);
        actionContainer.append(paused);
        actionContainer.append(clear);
        actionContainer.append(stepThousand);
        this.actionLocation.append(actionContainer);

        // Toggle show guides state
        showGuides.addEventListener('click', () => {
            this.painter.showGuide = this.painter.showGuide === false;
            if(this.painter.showGuide === true) {
                this.painter.drawCircles();
            } else {

            }
        });

        // Toggle pause state
        paused.addEventListener('click', e => {
            this.engine.paused = this.engine.paused === false;
            if (this.engine.paused) {
                e.target.innerHTML = 'Play';
            } else {
                e.target.innerHTML = 'Pause';
            }
        });

        // clear canvas
        clear.addEventListener('click', () => {
            this.painter.clear();
        });

        // clear canvas
        stepThousand.addEventListener('click', () => {
            for(let i = 0; i<1000; i++) {
                this.engine.runOnce()
            }
        });

        return this;
    }

    engineControls() {
        const controlEngineContainer = document.createElement('div');
        controlEngineContainer.classList.add('control-engine','control-group');

        const controlHead = document.createElement('div');
        controlHead.classList.add('section-head');
        controlHead.innerHTML = "Engine";

        const controlBody = document.createElement('div');
        controlBody.classList.add('section-body');

        const interval = this.createControl('interval', 'number', {
            value: this.engine.interval,
            target: this.engine,
        });

        const backgroundFill = this.createControl('backgroundFill', 'color', {
            value: this.painter.backgroundFill,
            target: this.painter,
            callback: this.painter.fillBackground.bind(this.painter)
        });

        const color = this.createControl('color', 'color', {
            value: this.painter.color,
            target: this.painter,
        });

        controlBody.append(interval);
        controlBody.append(color);
        controlBody.append(backgroundFill);

        controlEngineContainer.append(controlHead);
        controlEngineContainer.append(controlBody);

        return controlEngineContainer;
    }

    shapeControls() {
        const controlShapesContainer = document.createElement('div');
        controlShapesContainer.classList.add('control-shapes', 'control-group');

        this.engine.list.forEach(circle => {
            const circleControls = document.createElement('div');
            circleControls.classList.add('control-circle', 'control-group');
            circleControls.setAttribute('data-circle-id', circle.id);

            const controlHead = document.createElement('div');
            controlHead.classList.add('section-head');
            controlHead.innerHTML = "Circle #"+circle.id;

            const controlBody = document.createElement('div');
            controlBody.classList.add('section-body');

            const circleSteps = this.createControl('steps','number',{
                value:circle.steps,
            });

            const radiusSteps = this.createControl('radius','number',{
                value:circle.radius,
            });

            const fixed = this.createControl('fixed','boolean',{
                value: circle.fixed,
            });

            let brushControls = '';
            if(typeof this.painter.brushes[circle.id] !== 'undefined') {
                brushControls = this.brushControls(circle);
            }

            circleControls.append(controlHead);
            controlBody.append(circleSteps);
            controlBody.append(radiusSteps);
            controlBody.append(fixed);
            controlBody.append(brushControls);
            circleControls.append(controlBody);

            controlShapesContainer.append(circleControls);

            circleControls.addEventListener('input', function(event) {
                const target = event.target;
                if(!target.classList.contains('input')) {
                    return;
                }
                const name = target.name;

                switch(target.type) {
                    case 'number':
                        circle[name] = parseInt(target.value);
                        break;
                    case 'checkbox':
                        circle[name] = target.checked;
                        break;
                }
            });
        });

        return controlShapesContainer;
    }

    brushControls(circle) {
        const brushesControls = document.createElement('div');
        brushesControls.classList.add('control-brushes', 'control-group');

        const brushesHead = document.createElement('div');
        brushesHead.classList.add('section-head');
        brushesHead.innerHTML = "Brushes";

        const brushesBody = document.createElement('div');
        brushesBody.classList.add('section-body');

        this.painter.brushes[circle.id].forEach(brush => {
            const brushControls = document.createElement('div');
            brushControls.classList.add('control-brush', 'control-group');

            const controlHead = document.createElement('div');
            controlHead.classList.add('section-head');
            controlHead.innerHTML = "Brush";

            const controlBody = document.createElement('div');
            controlBody.classList.add('section-body');

            const brushColor = this.createControl('color', this.controlsConfig.brushControls.color.type, {
                value: brush.color,
                target: brush
            });

            const brushOffset = this.createControl('offset', 'number', {
                value: brush.offset,
                target: brush
            });

            controlBody.append(brushColor);
            controlBody.append(brushOffset);

            brushControls.append(controlHead);
            brushControls.append(controlBody);

            brushesBody.append(brushControls);
        });

        brushesControls.append(brushesHead);
        brushesControls.append(brushesBody);

        return brushesControls;
    }

    showControls() {
        const controlsContainer = document.createElement('div');
        const engineControls = this.engineControls();
        const shapeControls = this.shapeControls();

        controlsContainer.classList.add('module', 'controls', 'control-group');

        controlsContainer.append(engineControls);
        controlsContainer.append(shapeControls);

        this.controlLocation.append(controlsContainer);

        return this;
    }

    createControl(name, type, options = {}) {
        const container = document.createElement('div');
        const label = document.createElement('label');
        let input;

        container.classList.add('control', "control-"+name);
        label.innerHTML = name;

        switch(type) {
            case 'number':
                input =  document.createElement('input');
                input.type = 'number';
                input.name = name;
                if(typeof options.value !== 'undefined') {
                    input.value = options.value;
                }
                break;
            case 'text':
                input =  document.createElement('input');
                input.type = 'text';
                input.name = name;
                if(typeof options.value !== 'undefined') {
                    input.value = options.value;
                }
                break;
            case 'boolean':
                input =  document.createElement('input');
                input.type = 'checkbox';
                input.name = name;
                input.value = true;
                if(typeof options.value !== 'undefined' && options.value === true) {
                    input.checked = true;
                }
                break;
            case 'color':
                input =  document.createElement('input');
                input.type = 'color';
                input.name = name;
                if(typeof options.value !== 'undefined') {
                    input.value = options.value;
                }
                break;
            default:
                return '';
        }
        input.classList.add('input');

        if(typeof options.target !== 'undefined') {
            this.addEvent(input, options.target, options.callback);
        }

        container.append(label);
        container.append(input);

        return container;
    }

    addEvent(trigger, target, callback) {
        trigger.addEventListener('input', function(event) {
            const name = trigger.name;
            switch(trigger.type) {
                case 'number':
                    target[name] = parseInt(trigger.value);
                    break;
                case 'color':
                case 'text':
                    target[name] = trigger.value;
                    break;
                case 'checkbox':
                    target[name] = trigger.checked;
                    break;
            }
            if (typeof callback === 'function') {
                callback.call(null, this);
            }
        });
    }
}