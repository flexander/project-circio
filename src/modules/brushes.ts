import {BrushInterface} from "../structure";

export default class DotBrush implements BrushInterface {
    color: string;
    degrees: number;
    draw: boolean;
    link: boolean;
    offset: number;
    point: number;
}
