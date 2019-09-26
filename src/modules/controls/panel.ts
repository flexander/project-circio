import {
    ControlInterface,
    ControlPanelInterface,
    EventEmitter,
    EventInterface,
    ShapeControlInterface
} from "../../structure";

export default class ControlPanel extends EventEmitter implements ControlPanelInterface {
    protected controls: ControlInterface[] = [];
    protected name: string;
    protected simplified: boolean = true;

    constructor(name: string = null) {
        super();
        this.name = name;

        this.addControl(this.makeSimplifyControl());
    }

    public addControl(control: ControlInterface): void {
        this.controls.push(control);
    }

    public addControls(controls: ControlInterface[]): void {
        controls.forEach((control: ControlInterface) => this.addControl(control));
    }

    public render(): DocumentFragment {
        const wrapperHtml = `
        <div class="control-group">
            <div class="section-body"></div>
        </div>`;

        const controlPanelFragment = document.createRange().createContextualFragment(wrapperHtml);

        if (this.name !== null) {
            const headerFragment = document.createRange().createContextualFragment(`<div class="section-head">${this.name}</div>`);

            controlPanelFragment.prepend(headerFragment);
        }

        const controlPanelBodyEl = controlPanelFragment.querySelector('.section-body');

        this.controls.forEach((control: ControlInterface) => {
            controlPanelBodyEl.appendChild(control.render());
        });

        return controlPanelFragment;
    }

    protected makeSimplifyControl(): ShapeControlInterface {
        const self = this;
        return new class implements ControlInterface {
            render(): DocumentFragment {
                const checked = (self.simplified === true) ? 'checked' : '';
                const html = `
                <div class="control control-fixed">
                    <label>Simple Controls</label>
                    <input type="checkbox" name="simpleControls" value="true" class="input" ${checked}>
                </div>`;

                const fragment = document.createRange().createContextualFragment(html);
                const input = fragment.querySelector('input');

                input.addEventListener('input', e => {
                    self.simplified = (e.target as HTMLInputElement).checked === true;
                    self.dispatchEvent(new SimplifyControlsEvent());
                });

                return fragment;
            }
        };
    }

}

class SimplifyControlsEvent implements EventInterface {
    getContext(): any[] {
        return [];
    }

    getName(): string {
        return "controls.simplify";
    }

}