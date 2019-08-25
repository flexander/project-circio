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
    GuidePainterInterface,
    ShapeControlInterface,
    ShapeInterface
} from "../structure";
import {Circle} from "./circle";


class ControlPanel implements ControlPanelInterface {
    protected controls: ControlInterface[] = [];
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    public addControl(control: ControlInterface): void {
        this.controls.push(control);
    }

    public render(): DocumentFragment {
        const wrapperHtml = `
        <div class="control-group">
            <div class="section-head">${this.name}</div>
            <div class="section-body"></div>
        </div>`;

        const controlPanelFragment = document.createRange().createContextualFragment(wrapperHtml);
        const controlPanelBodyEl = controlPanelFragment.querySelector('.section-body');

        this.controls.forEach((control: ControlInterface) => {
            controlPanelBodyEl.appendChild(control.render());
        });

        return controlPanelFragment;
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
                    <button class="paused">${this.getPlayButtonLabel()}</button>
                    <button class="stepThousand">Step 1000</button>
                </div>
                <div class="control control-interval">
                    <label>interval</label>
                    <input type="number" name="interval" class="input" value="${this.engine.getStepInterval()}">
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
            e.target.innerText = this.getPlayButtonLabel();
        });

        engineFragment.querySelector('button.stepThousand').addEventListener('click', e => {
            const remainingSteps = this.engine.getRemainingStepsToRun();

            this.engine.pause();
            this.engine.stepFast(1000);
            this.engine.play(remainingSteps);
        });

        engineFragment.querySelector('input[name="interval"]').addEventListener('input', e => {
            this.engine.setStepInterval(parseInt(e.target.value));
        });

        engineFragment.append(this.circControl.render());

        return engineFragment;
    }

    protected getPlayButtonLabel() {
        return (this.engine.isPlaying()) ? 'Pause' : 'Play';
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
                    <button class="show">${this.getShowButtonLabel()}</button>
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
            e.target.innerText = this.getShowButtonLabel();
        });

        return painterFragment;
    }

    protected getShowButtonLabel() {
        return (this.guidePainter.isVisible()) ? 'Hide' : 'Show';
    }
}

class CircControl implements CircControlInterface {
    protected circ: CircInterface;
    protected shapeControls: ShapeControlInterface[] = [];
    protected panel: ControlPanelInterface;

    constructor(circ: CircInterface) {
        this.circ = circ;
        this.panel = new ControlPanel('Circ');

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
            this.circle.steps = parseInt(e.target.value);
        });
        documentFragment.querySelector('input[name="radius"]').addEventListener('input', e => {
            this.circle.radius = parseInt(e.target.value);
        });
        documentFragment.querySelector('input[name="stepMod"]').addEventListener('input', e => {
            this.circle.stepMod = parseInt(e.target.value);
        });
        documentFragment.querySelector('input[name="outside"]').addEventListener('input', e => {
            this.circle.outside = e.target.checked === true;
        });
        documentFragment.querySelector('input[name="clockwise"]').addEventListener('input', e => {
            this.circle.clockwise = e.target.checked === true;
        });
        documentFragment.querySelector('input[name="fixed"]').addEventListener('input', e => {
            this.circle.fixed = e.target.checked === true;
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

    render(): DocumentFragment {
        const linkChecked = (this.brush.link === true) ? 'checked':'';

        const html = `
        <div class="control-brush control-group">
            <div class="section-head">Brush</div>
            <div class="section-body">
                <div class="control control-color">
                    <label>color</label>
                    <input type="text" name="color" class="input" value="${this.brush.color}">
                </div>
                <div class="control control-offset">
                    <label>offset</label>
                    <input type="number" name="offset" class="input" value="${this.brush.offset}">
                </div>
                <div class="control control-degrees">
                    <label>degrees</label>
                    <input type="number" name="degrees" class="input" value="${this.brush.degrees}">
                </div>
                <div class="control control-link">
                    <label>link</label>
                    <input type="checkbox" name="link" value="true" class="input" ${linkChecked}>
                </div>
                <div class="control control-point">
                    <label>point</label>
                    <input type="number" name="point" step="0.5" class="input" value="${this.brush.point}">
                </div>
            </div>
        </div>`;

        const brushFragment = document.createRange().createContextualFragment(html);

        brushFragment.querySelector('input[name="color"]').addEventListener('input', e => {
            this.brush.color = e.target.value;
        });
        brushFragment.querySelector('input[name="offset"]').addEventListener('input', e => {
            this.brush.offset = e.target.value;
        });
        brushFragment.querySelector('input[name="degrees"]').addEventListener('input', e => {
            this.brush.degrees = e.target.value;
        });
        brushFragment.querySelector('input[name="point"]').addEventListener('input', e => {
            this.brush.point = e.target.value;
        });
        brushFragment.querySelector('input[name="link"]').addEventListener('input', e => {
            this.brush.link = e.target.checked === true;
        });

        return brushFragment;
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
                <input type="color" name="backgroundFill" class="input">
            </div>`;
        const backgroundControlFragment = document.createRange().createContextualFragment(backgroundControlHtml);

        backgroundControlFragment.querySelector('input[name="backgroundFill"]').addEventListener('input', e => {
            this.circ.backgroundFill = e.target.value;
        });

        return backgroundControlFragment;
    }

}

export {
    ControlPanel,
    EngineControl,
    CircControl,
    CircleControl,
    GuidePainterControl,
}
