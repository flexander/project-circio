import {ControlInterface, GuidePainterInterface, QuickControlInterface} from "../../structure";

export default class GuidePainterControl implements ControlInterface, QuickControlInterface {
    protected guidePainter: GuidePainterInterface;

    constructor(guide: GuidePainterInterface) {
        this.guidePainter = guide;
    }

    public render(): DocumentFragment {
        return document.createDocumentFragment();
    }

    protected makeVisibilityFragment(): DocumentFragment {
        const html = `<button class="show">${this.getShowButtonLabel()}</button>`;

        const visibilityFragment = document.createRange().createContextualFragment(html);

        visibilityFragment.querySelector('button.show').addEventListener('click', e => {
            if (this.guidePainter.isVisible()) {
                this.guidePainter.hide();
            } else {
                this.guidePainter.show();
            }
            (e.target as HTMLElement).innerText = this.getShowButtonLabel();
        });

        return visibilityFragment;
    }

    public getQuickControls(): ControlInterface[] {
        const self = this;

        return [
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeVisibilityFragment();
                }
            },
        ];
    }

    protected getShowButtonLabel() {
        return (this.guidePainter.isVisible()) ? 'No Guides' : 'Guides';
    }
}
