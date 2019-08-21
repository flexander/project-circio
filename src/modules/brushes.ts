import {BrushInterface} from "../structure";

export default class Brush implements BrushInterface {
    color: string;
    degrees: number;
    draw: boolean;
    link: boolean;
    offset: number;
    point: number;
}
