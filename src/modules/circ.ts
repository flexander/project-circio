import {CircInterface, CircStateInterface, ShapeInterface} from "../structure";

export default class Circ implements CircInterface {
    height: number;
    width: number;
    backgroundFill: string;
    stepsToComplete: number;
    shapes: ShapeInterface[];
    state: CircStateInterface;
}