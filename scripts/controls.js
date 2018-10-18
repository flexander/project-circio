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
        this.actionLocation.prepend(actionContainer);

        // Toggle show guides state
        showGuides.addEventListener('click', () => {
            this.painter.showGuide = this.painter.showGuide === false;
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
            this.painter.clear();
            return;
        });

        return this;
    }

    showControls() {

        let controlContainer = document.createElement('div');
        controlContainer.classList.add('circle-controls');

        this.engine.list.forEach(circle => {
            let circleControls = document.createElement('div');
            circleControls.classList.add('circle-control');
            circleControls.setAttribute('data-circle-id', circle.id);

            let circleSteps = this.createControl('steps','number',{
                legend:'circle #'+circle.id,
                value:circle.steps,
            });
            circleControls.append(circleSteps);

            controlContainer.append(circleControls);
        });

        this.controlLocation.append(controlContainer);

        return this;
    }

    createControl(name, type = 'text', options = {}) {
        let container = document.createElement('fieldset');
        let label = document.createElement('label');
        let input = document.createElement('input');

        container.classList.add('control', "control-"+name);
        label.innerHTML = name;
        input.type = type;
        input.name = name;

        if(typeof options.value !== 'undefined') {
            input.value = options.value;
        }

        if(typeof options.legend !== 'undefined') {
            let legend = document.createElement('legend');
            legend.innerHTML = options.legend;
            container.append(legend);
        }

        container.append(label);
        container.append(input);

        return container;
    }
}