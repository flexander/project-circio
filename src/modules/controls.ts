import {
    BrushControlInterface,
    CircControlInterface,
    CircInterface,
    CircleControlInterface,
    CircleInterface,
    ControlInterface,
    ControlPanelInterface,
    EngineControlInterface,
    EngineInterface,
    GuidePainterInterface,
    ShapeControlInterface,
    ShapeInterface
} from "../structure";
import {Circle} from "./circle";


class ControlPanel implements ControlPanelInterface {
    protected controls: ControlInterface[] = [];

    public addControl(control: ControlInterface): void {
        this.controls.push(control);
    }

    public render(): DocumentFragment {
        const fragment = document.createDocumentFragment();

        this.controls.forEach((control: ControlInterface) => {
            fragment.appendChild(control.render());
        });

        return fragment;
    }

}

class EngineControl implements EngineControlInterface {
    protected circControl: CircControlInterface;
    protected engine: EngineInterface;

    constructor(engine: EngineInterface) {
        this.engine = engine;
    }

    public addCircControl(circControl: CircControlInterface): void {
        this.circControl = circControl;
    }

    public render(): DocumentFragment {

        const html = `
        <div class="control-engine control-group">
            <div class="section-head">Engine</div>
            <div class="section-body">
                <div class="control">
                    <button class="paused">Play</button>
                    <button class="stepThousand">Step 1000</button>
                </div>
                <div class="control control-interval">
                    <label>interval</label>
                    <input type="number" name="interval" class="input" value="${this.engine.getStepInterval()}">
                </div>
                <div class="control control-backgroundFill">
                    <label>backgroundFill</label>
                    <input type="color" name="backgroundFill" class="input">
                </div>
            </div>
        </div>`;

        const engineFragment = document.createRange().createContextualFragment(html);

        engineFragment.querySelector('button.paused').addEventListener('click', e => {
            if (this.engine.isPlaying()) {
                this.engine.pause();
            } else {
                this.engine.play();
            }
        });

        engineFragment.querySelector('button.stepThousand').addEventListener('click', e => {
            const remainingSteps = this.engine.getRemainingStepsToRun();

            this.engine.pause();
            this.engine.stepFast(1000);
            this.engine.play(remainingSteps);
        });

        engineFragment.querySelector('input[name="interval"]').addEventListener('change', e => {
            this.engine.setStepInterval(parseInt(e.target.value));
        });

        engineFragment.append(this.circControl.render());

        return engineFragment;
    }

}

class GuidePainterControl implements ControlInterface {
    protected guidePainter: GuidePainterInterface;

    constructor(guide: GuidePainterInterface) {
        this.guidePainter = guide;
    }

    public render(): DocumentFragment {

        const html = `
        <div class="control-engine control-group">
            <div class="section-head">Guides</div>
            <div class="section-body">
                <div class="control">
                    <button class="show">Show</button>
                </div>
            </div>
        </div>`;

        const painterFragment = document.createRange().createContextualFragment(html);

        painterFragment.querySelector('button.show').addEventListener('click', e => {
            if (this.guidePainter.isVisible()) {
                this.guidePainter.hide();
            } else {
                this.guidePainter.show();
            }
        });

        return painterFragment;
    }

}

class CircControl implements CircControlInterface {
    protected circ: CircInterface;
    protected shapeControls: ShapeControlInterface[] = [];

    constructor(circ: CircInterface) {
        this.circ = circ;

        this.circ.shapes
            .forEach((shape: ShapeInterface) => {
                let shapeControl;

                if (shape instanceof Circle) {
                    shapeControl = new CircleControl(shape);
                }  else {
                    throw `Unable to render shape: ` + typeof shape;
                }

                this.shapeControls.push(shapeControl)
            });
    }

    public render(): DocumentFragment {
        const fragment = document.createDocumentFragment();

        this.shapeControls
            .forEach((shapeControl: ShapeControlInterface) => {
                fragment.appendChild(shapeControl.render());
            });

        return fragment;
    }
}

class CircleControl implements CircleControlInterface {
    protected circle: CircleInterface;
    protected brushControls: BrushControlInterface[] = [];

    constructor(circle: CircleInterface) {
        this.circle = circle;
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

        documentFragment.querySelector('input[name="steps"]').addEventListener('keyup', e => {
            this.circle.steps = parseInt(e.target.value);
        });
        documentFragment.querySelector('input[name="radius"]').addEventListener('keyup', e => {
            this.circle.radius = parseInt(e.target.value);
        });
        documentFragment.querySelector('input[name="stepMod"]').addEventListener('keyup', e => {
            this.circle.stepMod = parseInt(e.target.value);
        });
        documentFragment.querySelector('input[name="outside"]').addEventListener('change', e => {
            this.circle.outside = e.target.checked === true;
        });
        documentFragment.querySelector('input[name="clockwise"]').addEventListener('change', e => {
            this.circle.clockwise = e.target.checked === true;
        });
        documentFragment.querySelector('input[name="fixed"]').addEventListener('change', e => {
            this.circle.fixed = e.target.checked === true;
        });

        return documentFragment;
    }

}

export {
    ControlPanel,
    EngineControl,
    CircControl,
    CircleControl,
    GuidePainterControl,
}
