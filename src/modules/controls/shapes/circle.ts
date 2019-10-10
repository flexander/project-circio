import ShapeControl from "../shape";
import {CircleInterface} from "../../../structure";
import {ControlModes} from "../mode";

export default class CircleControl extends ShapeControl {
    protected shape: CircleInterface;

    constructor(shape: CircleInterface, mode: string = ControlModes.MODE_DEFAULT) {
        super(shape, mode);
    }

    protected getControlFragments(): DocumentFragment[] {
        const documentFragments = super.getControlFragments();
        documentFragments.unshift(this.makeRadiusFragment());

        return documentFragments;
    }

    protected makeRadiusFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>radius</label>
                <input type="number" name="radius" min="1" class="input" value="${this.shape.radius}">
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.shape.radius = parseInt((e.target as HTMLInputElement).value);
        });

        this.shape.addEventListener('change.radius', (value) => {
            input.value = value;
        });

        return fragment;
    }
}
