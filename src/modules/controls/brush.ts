import {BrushControlInterface, BrushInterface} from "../../structure";

export default class BrushControl implements BrushControlInterface {
    protected brush: BrushInterface;

    constructor(brush: BrushInterface) {
        this.brush = brush;
    }

    public render(): DocumentFragment {
        const html = `
        <div class="control-brush control-group">
            <div class="section-head">Brush</div>
            <div class="section-body">
            </div>
        </div>`;

        const brushFragment = document.createRange().createContextualFragment(html);

        const brushFragmentBody = brushFragment.querySelector('.section-body');
        brushFragmentBody.appendChild(this.makeColourFragment());
        brushFragmentBody.appendChild(this.makeOffsetFragment());
        brushFragmentBody.appendChild(this.makeAngleFragment());
        brushFragmentBody.appendChild(this.makeLinkFragment());
        brushFragmentBody.appendChild(this.makePointFragment());

        return brushFragment;
    }

    protected makeColourFragment(): DocumentFragment {
        const html = `
            <div class="control control-color">
                <label>color</label>
                <input type="text" name="color" class="input" value="${this.brush.color}">
            </div>`;

        const colourFragment = document.createRange().createContextualFragment(html);

        colourFragment.querySelector('input[name="color"]').addEventListener('input', e => {
            this.brush.color = (e.target as HTMLInputElement).value;
        });

        return colourFragment;
    }

    protected makeOffsetFragment(): DocumentFragment {
        const html = `
            <div class="control control-offset">
                <label>offset</label>
                <input type="number" name="offset" class="input" value="${this.brush.offset}">
            </div>`;

        const offsetFragment = document.createRange().createContextualFragment(html);

        offsetFragment.querySelector('input[name="offset"]').addEventListener('input', e => {
            this.brush.offset = parseInt((e.target as HTMLInputElement).value,10);
        });

        return offsetFragment;
    }

    protected makeAngleFragment(): DocumentFragment {
        const html = `
            <div class="control control-degrees">
                <label>degrees</label>
                <input type="number" name="degrees" class="input" value="${this.brush.degrees}">
            </div>`;

        const angleFragment = document.createRange().createContextualFragment(html);

        angleFragment.querySelector('input[name="degrees"]').addEventListener('input', e => {
            this.brush.degrees = parseInt((e.target as HTMLInputElement).value,10);
        });

        return angleFragment;
    }

    protected makeLinkFragment(): DocumentFragment {
        const linkChecked = (this.brush.link === true) ? 'checked':'';

        const html = `
            <div class="control control-link">
                <label>link</label>
                <input type="checkbox" name="link" value="true" class="input" ${linkChecked}>
            </div>`;

        const linkFragment = document.createRange().createContextualFragment(html);

        linkFragment.querySelector('input[name="link"]').addEventListener('input', e => {
            this.brush.link = (e.target as HTMLInputElement).checked === true;
        });

        return linkFragment;
    }

    protected makePointFragment(): DocumentFragment {
        const html = `
            <div class="control control-point">
                <label>point</label>
                <input type="number" name="point" step="0.5" class="input" value="${this.brush.point}">
            </div>`;

        const pointFragment = document.createRange().createContextualFragment(html);

        pointFragment.querySelector('input[name="point"]').addEventListener('input', e => {
            this.brush.point = parseInt((e.target as HTMLInputElement).value,10);
        });

        return pointFragment;
    }

}