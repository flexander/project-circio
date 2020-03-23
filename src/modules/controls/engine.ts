import {
    CircControlInterface, CircInterface,
    ControlInterface,
    EngineControlInterface,
    EngineInterface,
    QuickControlInterface
} from "../../structure";
import {ControlModes} from "./mode";
import {StoreRandom} from "../storeRandom";
import {Randomiser, threeCircleConfigGenerators} from "../randomiser";

export default class EngineControl implements EngineControlInterface, QuickControlInterface {
    protected circControl: CircControlInterface;
    protected engine: EngineInterface;
    protected mode: string;

    constructor(engine: EngineInterface, mode: string = ControlModes.MODE_DEFAULT) {
        this.engine = engine;
        this.mode = mode;
    }

    public addCircControl(circControl: CircControlInterface): void {
        this.circControl = circControl;
    }

    public render(): DocumentFragment {
        const engineFragment = document.createDocumentFragment();

        if (this.mode === ControlModes.MODE_SIMPLE) {
            engineFragment.appendChild(this.makeSimpleIntervalFragment());
        } else if (this.mode === ControlModes.MODE_ADVANCED) {
            engineFragment.appendChild(this.makeAdvancedIntervalFragment());
        }

        engineFragment.appendChild(this.circControl.render());

        return engineFragment;
    }

    protected makeAdvancedIntervalFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>Step Interval</label>
                <input type="number" name="interval" min="0" class="input" value="${this.engine.stepInterval}">
            </div>`;

        const intervalFragment = document.createRange().createContextualFragment(html);

        intervalFragment.querySelector('input[name="interval"]').addEventListener('input', e => {
            this.engine.stepInterval = parseInt((e.target as HTMLInputElement).value);
        });

        return intervalFragment;
    }

    protected makeSimpleIntervalFragment(): DocumentFragment {
        const slowChecked = this.engine.stepInterval === 1 ? '':'checked';

        const html = `
            <div class="control">
                <label>Slow Mode</label>
                <input type="checkbox" name="slowMode" class="input" ${slowChecked}>
            </div>`;

        const intervalFragment = document.createRange().createContextualFragment(html);

        intervalFragment.querySelector('input[name="slowMode"]').addEventListener('input', e => {
            if ((e.target as HTMLInputElement).checked === true) {
                this.engine.stepInterval = 100;
            } else {
                this.engine.stepInterval = 1;
            }
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

        this.engine.addEventListeners(['pause','play','stepJump.start','stepJump.end'], (value) => {
            button.innerText = this.getPlayButtonLabel();
        });

        return playFragment;
    }

    protected makeRandomFragment(): DocumentFragment {
        const html = `<button>Random</button>`;

        const randomFragment = document.createRange().createContextualFragment(html);
        const button = randomFragment.querySelector('button');

        button.addEventListener('click', e => {
            const randomStore = new StoreRandom();

            randomStore.get()
                .then((circ: CircInterface) => {
                    this.engine.pause();
                    this.engine.import(circ);
                    this.engine.stepFast(circ.stepsToComplete)
                });
        });

        return randomFragment;
    }

    protected makeSeededRandomFragment(): DocumentFragment {
        const html = `
            Seed: <input id="seededRandomInput" type="text" name="seed">
            <button>Seeded Random</button>
        `;

        const seededRandomFragment = document.createRange().createContextualFragment(html);
        const button = seededRandomFragment.querySelector('button');

        button.addEventListener('click', e => {
            const textArea: HTMLInputElement = document.querySelector('#seededRandomInput') as HTMLInputElement;
            const textAreaValue = textArea.value;

            const randomiser = new Randomiser(textAreaValue);

            randomiser.make(threeCircleConfigGenerators)
                .then((circ: CircInterface) => {
                    this.engine.pause();
                    this.engine.import(circ);
                    this.engine.stepFast(circ.stepsToComplete)
                });
        });

        return seededRandomFragment;
    }

    protected makeStepJumpFragment(): DocumentFragment {
        const html = `<button class="stepThousand">Step 1000</button>`;

        const stepJumpFragment = document.createRange().createContextualFragment(html);
        const stepJumpButton = stepJumpFragment.querySelector('button.stepThousand');

        stepJumpButton.addEventListener('click', e => {
            this.engine.stepFast(1000);
        });

        this.engine.addEventListener('stepJump.start', _ => {
            stepJumpButton.setAttribute('disabled', 'disabled');
        });

        this.engine.addEventListener('stepJump.end', _ => {
            stepJumpButton.removeAttribute('disabled');
        });

        return stepJumpFragment;
    }

    protected makeStepJumpByFragment(): DocumentFragment {
        const html = `<button class="stepBy">Step By...</button>`;

        const stepJumpByFragment = document.createRange().createContextualFragment(html);
        const stepJumpByButton = stepJumpByFragment.querySelector('button.stepBy');

        stepJumpByButton.addEventListener('click', e => {
            const stepsToRun = parseInt(prompt('Steps To Run'));
            if (isNaN(stepsToRun) === true || stepsToRun === null) {
                return;
            }

            this.engine.stepFast(stepsToRun);
        });

        this.engine.addEventListener('stepJump.start', _ => {
            stepJumpByButton.setAttribute('disabled', 'disabled');
        });

        this.engine.addEventListener('stepJump.end', _ => {
            stepJumpByButton.removeAttribute('disabled');
        });

        return stepJumpByFragment;
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
                    return self.makeStepJumpByFragment();
                }
            },
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeResetFragment();
                }
            },
            // new class implements ControlInterface {
            //     render(): DocumentFragment {
            //         return self.makeRandomFragment();
            //     }
            // },
            // new class implements ControlInterface {
            //     render(): DocumentFragment {
            //         return self.makeSeededRandomFragment();
            //     }
            // },
        ];
    }

    protected getPlayButtonLabel() {
        return (this.engine.isPlaying()) ? 'Pause' : 'Play';
    }

}
