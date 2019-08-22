import {
    BrushControlInterface, CircControlInterface, CircInterface,
    CircleControlInterface,
    CircleInterface,
    ControlInterface,
    ControlPanelInterface, EngineControlInterface, EngineInterface, ShapeControlInterface, ShapeInterface
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
        return this.circControl.render();
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
            <div class="section-head">Circle #0</div>
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

        return document.createRange().createContextualFragment(html);
    }

}

export {
    ControlPanel,
    EngineControl,
    CircControl,
    CircleControl,
}
