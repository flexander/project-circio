import {BrushControlInterface, BrushInterface, CircleControlInterface, CircleInterface} from "../../../structure";
import BrushControl from "../brush";
import {ControlModes} from "../mode";

export default class CircleControl implements CircleControlInterface {
    protected circle: CircleInterface;
    protected brushControls: BrushControlInterface[] = [];
    protected mode: string;

    constructor(circle: CircleInterface, mode: string = ControlModes.MODE_SIMPLE) {
        this.circle = circle;
        this.mode = mode;

        this.circle.brushes.forEach((brush: BrushInterface) => {
            this.addBrushControl(new BrushControl(brush));
        });
    }

    public addBrushControl(brushControl: BrushControlInterface): void {
        this.brushControls.push(brushControl);
    }

    public render(): DocumentFragment {

        if (this.circle === null) {
            return document.createDocumentFragment();
        }

        const html = `
        <details class="control-group" data-shape-id="${this.circle.id}" open>
            <summary>
                Circle
            </summary>
            <div class="section-body"></div>
        </details>
        `;

        const deleteButtonHtml = `
            <div style="float: right;">
                <span class="shapeDelete" style="text-transform: uppercase; font-size: 0.6rem; color: darkred; cursor: pointer">Delete</span>
            </div>`;

        const documentFragment = document.createRange().createContextualFragment(html);
        const shapeDeleteFragment = document.createRange().createContextualFragment(deleteButtonHtml);
        const documentFragmentBody = documentFragment.querySelector('.section-body');

        if (this.circle.isRoot === false) {
            documentFragment.querySelector('summary').appendChild(shapeDeleteFragment);
        }

        this.getControlFragments().forEach((fragment: DocumentFragment) => {
            documentFragmentBody.appendChild(fragment);
        });

        this.brushControls.forEach((brushControl: BrushControlInterface) => {
            documentFragmentBody.append(brushControl.render());
        });

        return documentFragment;
    }

    protected getControlFragments(): DocumentFragment[] {
        const documentFragments = [
            this.makeStepsFragment(),
            this.makeRadiusFragment(),
            this.makeDirectionFragment(),
        ];

        if (this.mode === ControlModes.MODE_ADVANCED) {
            documentFragments.push(this.makeStepModuloFragment());
        }

        if (this.circle.isRoot === false) {
            documentFragments.push(this.makeOutsideFragment());

            if (this.mode === ControlModes.MODE_ADVANCED) {
                documentFragments.push(this.makeFixedFragment());
            }
        }

        return documentFragments;
    }

    protected makeStepsFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>steps</label>
                <input type="number" name="steps" min="0" class="input" value="${this.circle.steps}">
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.circle.steps = parseInt((e.target as HTMLInputElement).value);
        });

        this.circle.addEventListener('change.steps', (value) => {
            input.value = value;
        });

        return fragment;
    }

    protected makeRadiusFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>radius</label>
                <input type="number" name="radius" min="1" class="input" value="${this.circle.radius}">
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.circle.radius = parseInt((e.target as HTMLInputElement).value);
        });

        this.circle.addEventListener('change.radius', (value) => {
            input.value = value;
        });

        return fragment;
    }

    protected makeStepModuloFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>stepMod</label>
                <input type="number" name="stepMod" min="0" class="input" value="${this.circle.stepMod}">
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.circle.stepMod = parseInt((e.target as HTMLInputElement).value);
        });

        this.circle.addEventListener('change.stepMod', (value) => {
            input.value = value;
        });

        return fragment;
    }

    protected makeOutsideFragment(): DocumentFragment {
        const outsideChecked = (this.circle.outside === true) ? 'checked':'';
        const html = `
            <div class="control">
                <label>outside</label>
                <input type="checkbox" name="outside" value="true" class="input" ${outsideChecked}>
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.circle.outside = (e.target as HTMLInputElement).checked === true;
        });

        this.circle.addEventListener('change.outside', (value) => {
            input.checked = value;
        });

        return fragment;
    }

    protected makeDirectionFragment(): DocumentFragment {
        const clockwiseChecked = (this.circle.clockwise === true) ? 'checked':'';
        const html = `
            <div class="control">
                <label>clockwise</label>
                <input type="checkbox" name="clockwise" value="true" class="input" ${clockwiseChecked}>
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.circle.clockwise = (e.target as HTMLInputElement).checked === true;
        });

        this.circle.addEventListener('change.clockwise', (value) => {
            input.checked = value;
        });

        return fragment;
    }

    protected makeFixedFragment(): DocumentFragment {
        const fixedChecked = (this.circle.fixed === true) ? 'checked':'';
        const html = `
            <div class="control control-fixed">
                <label>fixed</label>
                <input type="checkbox" name="fixed" value="true" class="input" ${fixedChecked}>
            </div>`;

        const fragment = document.createRange().createContextualFragment(html);
        const input = fragment.querySelector('input');

        input.addEventListener('input', e => {
            this.circle.fixed = (e.target as HTMLInputElement).checked === true;
        });

        this.circle.addEventListener('change.fixed', (value) => {
            input.checked = value;
        });

        return fragment;
    }
}
