import {
    CircControlInterface,
    ControlInterface,
    EngineControlInterface,
    EngineInterface,
    QuickControlInterface
} from "../../structure";

export default class EngineControl implements EngineControlInterface, QuickControlInterface {
    protected circControl: CircControlInterface;
    protected engine: EngineInterface;

    constructor(engine: EngineInterface) {
        this.engine = engine;
    }

    public addCircControl(circControl: CircControlInterface): void {
        this.circControl = circControl;
    }

    public render(): DocumentFragment {

        const engineFragment = document.createDocumentFragment();
        engineFragment.appendChild(this.makeIntervalFragment());
        engineFragment.appendChild(this.circControl.render());

        return engineFragment;
    }

    protected makeIntervalFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>interval</label>
                <input type="number" name="interval" min="0" class="input" value="${this.engine.getStepInterval()}">
            </div>`;

        const intervalFragment = document.createRange().createContextualFragment(html);

        intervalFragment.querySelector('input[name="interval"]').addEventListener('input', e => {
            this.engine.setStepInterval(parseInt((e.target as HTMLInputElement).value));
        });

        return intervalFragment;
    }

    protected makePlayFragment(): DocumentFragment {
        const html = `<button class="paused">${this.getPlayButtonLabel()}</button>`;

        const playFragment = document.createRange().createContextualFragment(html);
        const button = playFragment.querySelector('button');

        button.addEventListener('click', e => {
            if (this.engine.isPlaying()) {
                this.engine.pause();
            } else {
                this.engine.play();
            }
        });

        this.engine.addEventListener('pause', (value) => {
            button.innerText = this.getPlayButtonLabel();
        });

        this.engine.addEventListener('play', (value) => {
            button.innerText = this.getPlayButtonLabel();
        });

        return playFragment;
    }

    protected makeStepJumpFragment(): DocumentFragment {
        const html = `<button class="stepThousand">Step 1000</button>`;

        const stepJumpFragment = document.createRange().createContextualFragment(html);
        const stepJumpButton = stepJumpFragment.querySelector('button.stepThousand');

        stepJumpButton.addEventListener('click', e => {
            stepJumpButton.setAttribute('disabled', 'disabled');
            this.engine.stepFast(1000)
                .then(_ => {
                    stepJumpButton.removeAttribute('disabled');
                });
        });

        return stepJumpFragment;
    }

    protected makeResetFragment(): DocumentFragment {
        const html = `<button class="reset">Reset</button>`;

        const resetFragment = document.createRange().createContextualFragment(html);

        resetFragment.querySelector('button.reset').addEventListener('click', e => {
            this.engine.reset();
        });

        return resetFragment;
    }

    public getQuickControls(): ControlInterface[] {
        const self = this;

        return [
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makePlayFragment();
                }
            },
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeStepJumpFragment();
                }
            },
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeResetFragment();
                }
            },
        ];
    }

    protected getPlayButtonLabel() {
        return (this.engine.isPlaying()) ? 'Pause' : 'Play';
    }

}
