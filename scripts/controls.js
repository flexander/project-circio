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
        this.location = (typeof options.location !== 'undefined') ? options.location: document.body;
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
        this.location.prepend(actionContainer);

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

        // clear canvas
        stepThousand.addEventListener('click', () => {
            for(let i = 0; i<1000; i++) {
                this.engine.runOnce()
            }

            return;
        });
    }
}