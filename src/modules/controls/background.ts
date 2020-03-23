import {BackgroundControlInterface, CircInterface} from "../../structure";

export default class BackgroundControl implements BackgroundControlInterface {
    protected circ: CircInterface;

    constructor(circ: CircInterface) {
        this.circ = circ;
    }

    render(): DocumentFragment {
        const backgroundControlHtml = `
            <div class="control control-backgroundFill">
                <label>backgroundFill</label>
                <input type="color" name="backgroundFill" class="input" value="${this.circ.backgroundFill}">
            </div>`;
        const backgroundControlFragment = document.createRange().createContextualFragment(backgroundControlHtml);

        backgroundControlFragment.querySelector('input[name="backgroundFill"]').addEventListener('input', e => {
            this.circ.backgroundFill = (e.target as HTMLInputElement).value;
        });

        return backgroundControlFragment;
    }
}
