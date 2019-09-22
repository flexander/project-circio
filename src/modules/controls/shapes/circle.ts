import {BrushControlInterface, BrushInterface, CircleControlInterface, CircleInterface} from "../../../structure";
import BrushControl from "../brush";

export default class CircleControl implements CircleControlInterface {
    protected circle: CircleInterface;
    protected brushControls: BrushControlInterface[] = [];

    constructor(circle: CircleInterface) {
        this.circle = circle;

        this.circle.brushes.forEach((brush: BrushInterface) => {
            this.addBrushControl(new BrushControl(brush));
        });
    }

    public addBrushControl(brushControl: BrushControlInterface): void {
        this.brushControls.push(brushControl);
    }

    public render(): DocumentFragment {

        const html = `
        <div class="control-circle control-group">
            <div class="section-head">Circle</div>
            <div class="section-body"></div>
        </div>
        `;

        const documentFragment = document.createRange().createContextualFragment(html);
        const documentFragmentBody = documentFragment.querySelector('.section-body');

        this.getControlFragments().forEach((fragment: DocumentFragment) => {
            documentFragmentBody.appendChild(fragment);
        });

        this.brushControls.forEach((brushControl: BrushControlInterface) => {
            documentFragment.append(brushControl.render());
        });

        return documentFragment;
    }

    protected getControlFragments(): DocumentFragment[] {
        const documentFragments = [
            this.makeStepsFragment(),
            this.makeRadiusFragment(),
            this.makeStepModuloFragment(),
            this.makeDirectionFragment(),
        ];

        if (this.circle.isRoot === false) {
            documentFragments.push(this.makeFixedFragment());
            documentFragments.push(this.makeOutsideFragment());
        }

        return documentFragments;
    }

    protected makeStepsFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>steps</label>
                <input type="number" name="steps" class="input" value="${this.circle.steps}">
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
                <input type="number" name="radius" class="input" value="${this.circle.radius}">
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
                <input type="number" name="stepMod" class="input" value="${this.circle.stepMod}">
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
