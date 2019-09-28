import {ControlInterface, EventEmitter, EventInterface, QuickControlInterface} from "../../structure";

class ModeControl extends EventEmitter implements ControlInterface, QuickControlInterface {
    protected currentMode: string;

    constructor(currentMode: string) {
        super();
        this.currentMode = currentMode;
    }

    public render(): DocumentFragment {
        return this.makeModeFragment();
    }

    protected makeModeFragment() {
        const html = `<button>${this.getModeButtonLabel()}</button>`;

        const modeFragment = document.createRange().createContextualFragment(html);
        const button = modeFragment.querySelector('button');

        button.addEventListener('click', e => {
            if (this.currentMode === ControlModes.MODE_ADVANCED) {
                this.dispatchEvent(new ControlModeEvent(ControlModes.MODE_SIMPLE));
            } else {
                this.dispatchEvent(new ControlModeEvent(ControlModes.MODE_ADVANCED));
            }


        });

        return modeFragment;
    }

    protected getModeButtonLabel() {
        return (this.currentMode === ControlModes.MODE_ADVANCED) ? 'Simple' : 'Advanced';
    }

    getQuickControls(): ControlInterface[] {
        const self = this;

        return [
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeModeFragment();
                }
            },
        ];
    }
}

class ControlModes {
    static get MODE_SIMPLE(): string {
        return 'simple';
    }

    static get MODE_ADVANCED(): string {
        return 'advanced';
    }

    static get MODE_DEFAULT(): string {
        return this.MODE_SIMPLE;
    }
}

class ControlModeEvent implements EventInterface {
    protected mode: string;

    constructor(mode: string) {
        this.mode = mode;
    }

    getContext(): any[] {
        return [this.mode];
    }

    getName(): string {
        return "controls.mode";
    }

}

export {
    ModeControl,
    ControlModes,
    ControlModeEvent,
}