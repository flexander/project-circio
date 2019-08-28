import {
    BackgroundControlInterface,
    BrushControlInterface, BrushInterface,
    CircControlInterface,
    CircInterface,
    CircleControlInterface,
    CircleInterface,
    ControlInterface,
    ControlPanelInterface,
    EngineControlInterface,
    EngineInterface,
    GuidePainterInterface, PainterInterface, QuickControlInterface,
    ShapeControlInterface,
    ShapeInterface
} from "../structure";
import {Circle} from "./circle";


class ControlPanel implements ControlPanelInterface {
    protected controls: ControlInterface[] = [];
    protected name: string;

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

class EngineControl implements EngineControlInterface, QuickControlInterface {
    protected circControl: CircControlInterface;
    protected engine: EngineInterface;

    constructor(engine: EngineInterface) {
        this.engine = engine;
    }

    public addCircControl(circControl: CircControlInterface): void {
        this.circControl = circControl;
    }

    public render(): DocumentFragment {

        const engineFragment = document.createDocumentFragment();
        engineFragment.appendChild(this.makeIntervalFragment());
        engineFragment.appendChild(this.circControl.render());

        return engineFragment;
    }

    protected makeIntervalFragment(): DocumentFragment {
        const html = `
            <div class="control">
                <label>interval</label>
                <input type="number" name="interval" class="input" value="${this.engine.getStepInterval()}">
            </div>`;

        const intervalFragment = document.createRange().createContextualFragment(html);

        intervalFragment.querySelector('input[name="interval"]').addEventListener('input', e => {
            this.engine.setStepInterval(parseInt((e.target as HTMLInputElement).value));
        });

        return intervalFragment;
    }

    protected makePlayFragment(): DocumentFragment {
        const html = `<button class="paused">${this.getPlayButtonLabel()}</button>`;

        const playFragment = document.createRange().createContextualFragment(html);

        playFragment.querySelector('button.paused').addEventListener('click', e => {
            if (this.engine.isPlaying()) {
                this.engine.pause();
            } else {
                this.engine.play();
            }
            (e.target as HTMLElement).innerText = this.getPlayButtonLabel();
        });

        return playFragment;
    }

    protected makeStepJumpFragment(): DocumentFragment {
        const html = `<button class="stepThousand">Step 1000</button>`;

        const stepJumpFragment = document.createRange().createContextualFragment(html);

        stepJumpFragment.querySelector('button.stepThousand').addEventListener('click', e => {
            const remainingSteps = this.engine.getRemainingStepsToRun();

            this.engine.pause();
            this.engine.stepFast(1000);
            this.engine.play(remainingSteps);
        });

        return stepJumpFragment;
    }

    protected makeResetFragment(): DocumentFragment {
        const html = `<button class="reset">Reset</button>`;

        const resetFragment = document.createRange().createContextualFragment(html);

        resetFragment.querySelector('button.reset').addEventListener('click', e => {
            this.engine.reset();
        });

        return resetFragment;
    }

    public getQuickControls(): ControlInterface[] {
        const self = this;

        return [
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makePlayFragment();
                }
            },
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeStepJumpFragment();
                }
            },
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeResetFragment();
                }
            },
        ];
    }

    protected getPlayButtonLabel() {
        return (this.engine.isPlaying()) ? 'Pause' : 'Play';
    }

}

class GuidePainterControl implements ControlInterface, QuickControlInterface {
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

class CircControl implements CircControlInterface {
    protected circ: CircInterface;
    protected shapeControls: ShapeControlInterface[] = [];
    protected panel: ControlPanelInterface;

    constructor(circ: CircInterface) {
        this.circ = circ;
        this.panel = new ControlPanel('Circ Name Here');

        this.panel.addControl(new BackgroundControl(this.circ));

        this.circ.shapes
            .forEach((shape: ShapeInterface) => {
                let shapeControl;

                if (shape instanceof Circle) {
                    shapeControl = new CircleControl(shape);
                }  else {
                    throw `Unable to render shape: ` + typeof shape;
                }

                this.panel.addControl(shapeControl)
            });
    }

    public render(): DocumentFragment {
        return this.panel.render();
    }
}

class PainterControl implements QuickControlInterface {
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

class CircleControl implements CircleControlInterface {
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
        const outsideChecked = (this.circle.outside === true) ? 'checked':'';
        const clockwiseChecked = (this.circle.clockwise === true) ? 'checked':'';
        const fixedChecked = (this.circle.fixed === true) ? 'checked':'';

        const html = `
        <div class="control-circle control-group">
            <div class="section-head">Circle</div>
            <div class="section-body">
                <div class="control">
                    <label>steps</label>
                    <input type="number" name="steps" class="input" value="${this.circle.steps}">
                </div>
                <div class="control">
                    <label>radius</label>
                    <input type="number" name="radius" class="input" value="${this.circle.radius}">
                </div>
                <div class="control">
                    <label>stepMod</label>
                    <input type="number" name="stepMod" class="input" value="${this.circle.stepMod}">
                </div>
                <div class="control">
                    <label>outside</label>
                    <input type="checkbox" name="outside" value="true" class="input" ${outsideChecked}>
                </div>
                <div class="control">
                    <label>clockwise</label>
                    <input type="checkbox" name="clockwise" value="true" class="input" ${clockwiseChecked}>
                </div>
                <div class="control control-fixed">
                    <label>fixed</label>
                    <input type="checkbox" name="fixed" value="true" class="input" ${fixedChecked}>
                </div>
            </div>
        </div>
        `;

        const documentFragment = document.createRange().createContextualFragment(html);

        documentFragment.querySelector('input[name="steps"]').addEventListener('input', e => {
            this.circle.steps = parseInt((e.target as HTMLInputElement).value);
        });
        documentFragment.querySelector('input[name="radius"]').addEventListener('input', e => {
            this.circle.radius = parseInt((e.target as HTMLInputElement).value);
        });
        documentFragment.querySelector('input[name="stepMod"]').addEventListener('input', e => {
            this.circle.stepMod = parseInt((e.target as HTMLInputElement).value);
        });
        documentFragment.querySelector('input[name="outside"]').addEventListener('input', e => {
            this.circle.outside = (e.target as HTMLInputElement).checked === true;
        });
        documentFragment.querySelector('input[name="clockwise"]').addEventListener('input', e => {
            this.circle.clockwise = (e.target as HTMLInputElement).checked === true;
        });
        documentFragment.querySelector('input[name="fixed"]').addEventListener('input', e => {
            this.circle.fixed = (e.target as HTMLInputElement).checked === true;
        });

        this.brushControls.forEach((brushControl: BrushControlInterface) => {
            documentFragment.append(brushControl.render());
        });

        return documentFragment;
    }

}

class BrushControl implements BrushControlInterface {
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

class BackgroundControl implements BackgroundControlInterface {
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

class QuickControlPanel extends ControlPanel {

}

export {
    ControlPanel,
    EngineControl,
    CircControl,
    CircleControl,
    GuidePainterControl,
    PainterControl,
}
