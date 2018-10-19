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
        let controlsContainer = document.createElement('div');
        controlsContainer.classList.add('module', 'controls');

        this.engine.list.forEach(circle => {
            let circleControls = document.createElement('div');
            circleControls.classList.add('circle-controls');
            circleControls.setAttribute('data-circle-id', circle.id);

            let controlHead = document.createElement('div');
            controlHead.classList.add('section-head');
            controlHead.innerHTML = "Circle #"+circle.id;

            let controlBody = document.createElement('div');
            controlBody.classList.add('section-body');

            let circleSteps = this.createControl('steps','number',{
                value:circle.steps,
            });

            let radiusSteps = this.createControl('radius','number',{
                legend:'circle #'+circle.id,
                value:circle.radius,
            });

            circleControls.append(controlHead);
            controlBody.append(circleSteps);
            controlBody.append(radiusSteps);
            circleControls.append(controlBody);

            controlsContainer.append(circleControls);

            circleControls.addEventListener('input', function(event) {
                const target = event.target;
                if(!target.classList.contains('input')) {
                    return;
                }
                const name = target.name;
                const value = target.value;
                circle[name] = value;
            });
        });

        this.controlLocation.append(controlsContainer);

        return this;
    }

    createControl(name, type = 'text', options = {}) {
        let container = document.createElement('div');
        let label = document.createElement('label');
        let input = document.createElement('input');

        container.classList.add('control', "control-"+name);
        label.innerHTML = name;
        input.type = type;
        input.name = name;
        input.classList.add('input');

        if(typeof options.value !== 'undefined') {
            input.value = options.value;
        }

        container.append(label);
        container.append(input);

        return container;
    }
}