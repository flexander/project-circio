import ShapeControl from "../shape";
import {PolygonInterface} from "../../../structure";
import {ControlModes} from "../mode";

export default class PolygonControl extends ShapeControl {
    protected shape: PolygonInterface;

    constructor(shape: PolygonInterface, mode: string = ControlModes.MODE_DEFAULT) {
        super(shape, mode);
    }

    protected getControlFragments(): DocumentFragment[] {
        const documentFragments = super.getControlFragments();
        documentFragments.unshift(this.makeFacesFragment());
        documentFragments.unshift(this.makeFaceWidthFragment());

        return documentFragments;
    }

    protected makeFaceWidthFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>face width</label>
                <input type="number" name="radius" min="1" class="input" value="${this.shape.faceWidth}">
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.shape.faceWidth = parseInt((e.target as HTMLInputElement).value);
        });

        this.shape.addEventListener('change.faceWidth', (value) => {
            input.value = value;
        });

        return fragment;
    }

    protected makeFacesFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>faces</label>
                <input type="number" name="radius" min="1" class="input" value="${this.shape.faces}">
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.shape.faces = parseInt((e.target as HTMLInputElement).value);
        });

        this.shape.addEventListener('change.faces', (value) => {
            input.value = value;
        });

        return fragment;
    }
}
