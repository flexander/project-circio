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
import Brush from "../brushes";

export default class CircControl implements CircControlInterface {
    protected circ: CircInterface;
    protected shapeControls: ShapeControlInterface[] = [];
    protected panel: ControlPanelInterface;

    constructor(circ: CircInterface) {
        this.circ = circ;
        this.panel = new ControlPanel('Circ: ' + (circ.name || 'Unnamed'));

        this.panel.addControl(new BackgroundControl(this.circ));

        this.circ.getShapes()
            .forEach((shape: ShapeInterface) => {
                let shapeControl;

                if (shape instanceof Circle) {
                    if (shape.isRoot) {

                    }
                    shapeControl = new CircleControl(shape);
                }  else {
                    throw `Unable to render shape: ` + typeof shape;
                }

                this.panel.addControl(shapeControl)
            });

        const addShapeControl = new class implements ControlInterface {
            render(): DocumentFragment {
                const addShapeFragmentHtml = `
                    <button>Add Shape</button>
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
                    
                    const newBrush = new Brush();
                    const newBrush2 = new Brush();
                    newShape.brushes.push(newBrush);
                    newShape.brushes.push(newBrush2);
                    circ.addShape(newShape);
                });

                return addShapeFragment;
            }
        };

        this.panel.addControl(addShapeControl);
    }

    public render(): DocumentFragment {
        return this.panel.render();
    }
}
