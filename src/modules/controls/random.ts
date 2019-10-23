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

export default class RandomControl implements ControlInterface, QuickControlInterface {
    protected engine: EngineInterface;
    protected mode: string;

    constructor(engine: EngineInterface, mode: string = ControlModes.MODE_DEFAULT) {
        this.engine = engine;
        this.mode = mode;
    }

    public render(): DocumentFragment {
        const randomFragment = document.createDocumentFragment();

        return randomFragment;
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


    public getQuickControls(): ControlInterface[] {
        const self = this;

        return [
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeRandomFragment();
                }
            },
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeSeededRandomFragment();
                }
            },
        ];
    }
}
