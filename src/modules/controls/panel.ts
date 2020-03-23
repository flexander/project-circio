import {ControlInterface, ControlPanelInterface} from "../../structure";

export default class ControlPanel implements ControlPanelInterface {
    protected controls: ControlInterface[] = [];
    protected name: string;
    protected simplified: boolean = true;

    constructor(name: string = null) {
        this.name = name;
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



}
