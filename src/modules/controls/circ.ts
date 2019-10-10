import {
    CircControlInterface,
    CircInterface, ControlInterface,
    ControlPanelInterface,
    ShapeControlInterface,
    ShapeInterface
} from "../../structure";
import {Circle} from "../circle";
import BackgroundControl from "./background";
import ControlPanel from "./panel";
import CircleControl from "./shapes/circle";
import {ControlModes} from "./mode";
import {Brush} from "../brushes";
import ShapeControl from "./shape";

export default class CircControl implements CircControlInterface {
    protected circ: CircInterface;
    protected panel: ControlPanelInterface;
    protected mode: string;

    constructor(circ: CircInterface, mode: string = ControlModes.MODE_DEFAULT) {
        this.circ = circ;
        this.mode = mode;
        this.panel = new ControlPanel('Circ: ' + (circ.name || 'Unnamed'));

        this.panel.addControl(new BackgroundControl(this.circ));

        this.circ.getShapes()
            .forEach((shape: ShapeInterface) => {
                let shapeControl;

                if (shape instanceof Circle) {
                    shapeControl = new CircleControl(shape, this.mode);
                }  else {
                    shapeControl = new ShapeControl(shape, this.mode);
                }

                this.panel.addControl(shapeControl)
            });

        this.panel.addControl(this.makeAddShapeControl());
    }

    protected makeAddShapeControl(): ShapeControlInterface {
        const self = this;

        return new class implements ControlInterface {
            render(): DocumentFragment {
                const addShapeFragmentHtml = `
                    <button>Add Circle</button>
                    `;

                const addShapeFragment = document.createRange().createContextualFragment(addShapeFragmentHtml);

                addShapeFragment.querySelector('button').addEventListener('click', e => {
                    const newShape = new Circle();
                    newShape.steps = 500;
                    newShape.outside = true;
                    newShape.fixed = true;
                    newShape.clockwise = true;
                    newShape.stepMod = 0;
                    newShape.startAngle = 0;
                    newShape.radius = 100;

                    newShape.addBrush(new Brush());

                    self.circ.addShape(newShape);
                });

                return addShapeFragment;
            }
        };
    }

    public render(): DocumentFragment {
        const panelFragment = this.panel.render();

        panelFragment.querySelector('.control-group').addEventListener('click', e => {
            if ((e.target as HTMLElement).closest('.shapeDelete') === null) {
                return;
            }

            const controlGroupEl = <HTMLElement>(e.target as HTMLElement).closest('.control-group');
            const shapeId = parseInt(controlGroupEl.dataset.shapeId);

            this.circ.removeShape(shapeId);
        });

        return panelFragment;
    }
}
