import {
    CircControlInterface,
    CircInterface,
    ControlPanelInterface,
    ShapeControlInterface,
    ShapeInterface
} from "../../structure";
import {Circle} from "../circle";
import BackgroundControl from "./background";
import ControlPanel from "./panel";
import CircleControl from "./shapes/circle";

export default class CircControl implements CircControlInterface {
    protected circ: CircInterface;
    protected shapeControls: ShapeControlInterface[] = [];
    protected panel: ControlPanelInterface;

    constructor(circ: CircInterface) {
        this.circ = circ;
        this.panel = new ControlPanel('Circ Name Here');

        this.panel.addControl(new BackgroundControl(this.circ));

        this.circ.getShapes()
            .forEach((shape: ShapeInterface) => {
                let shapeControl;

                if (shape instanceof Circle || true) {
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
