import {ControlInterface, PainterInterface, QuickControlInterface} from "../../structure";

export default class PainterControl implements QuickControlInterface {
    protected painter: PainterInterface;

    constructor(painter: PainterInterface) {
        this.painter = painter;
    }

    protected makeClearFragment(): DocumentFragment {
        const html = `<button class="clear">Clear</button>`;

        const clearFragment = document.createRange().createContextualFragment(html);

        clearFragment.querySelector('button.clear').addEventListener('click', e => {
            this.painter.clear();
        });

        return clearFragment;
    }

    public getQuickControls(): ControlInterface[] {
        const self = this;

        return [];
    }

}
