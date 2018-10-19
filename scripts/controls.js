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
        this.actionLocation = (typeof options.actionLocation !== 'undefined') ? options.actionLocation: document.body;
        this.controlLocation = (typeof options.controlLocation !== 'undefined') ? options.controlLocation: document.body;
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

        if (this.engine.paused) {
            paused.innerHTML = 'play';
        } else {
            paused.innerHTML = 'pause';
        }

        actionContainer.append(showGuides);
        actionContainer.append(paused);
        actionContainer.append(clear);
        this.actionLocation.prepend(actionContainer);

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

        return this;
    }

    showControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('module', 'controls');

        this.engine.list.forEach(circle => {
            const circleControls = document.createElement('div');
            circleControls.classList.add('circle-controls');
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

            circleControls.append(controlHead);
            controlBody.append(circleSteps);
            controlBody.append(radiusSteps);
            controlBody.append(fixed);
            circleControls.append(controlBody);

            controlsContainer.append(circleControls);

            circleControls.addEventListener('input', function(event) {
                const target = event.target;
                if(!target.classList.contains('input')) {
                    return;
                }
                const name = target.name;

                switch(target.type) {
                    case 'number':
                        const value = target.value;
                        circle[name] = value;
                        break;
                    case 'checkbox':
                        circle[name] = target.checked;
                        console.log(circle);
                        break;
                }

            });
        });

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
            case 'boolean':
                input =  document.createElement('input');
                input.type = 'checkbox';
                input.name = name;
                input.value = true;
                if(typeof options.value !== 'undefined' && options.value === true) {
                    input.checked = true;
                }
                break;
            default:
                return '';
        }
        input.classList.add('input');

        container.append(label);
        container.append(input);

        return container;
    }
}