import {BrushInterface} from "../structure";

export default class Brush implements BrushInterface {
    color: string = '#FFFFFF';
    degrees: number = 0;
    draw: boolean = true;
    link: boolean = false;
    offset: number = 0;
    point: number = 0.5;
}
