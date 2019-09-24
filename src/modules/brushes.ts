import {BrushInterface} from "../structure";

export default class Brush implements BrushInterface {
    hexcolor: string = '#FFFFFF';
    transparency: number = 0;
    degrees: number = 0;
    draw: boolean = true;
    link: boolean = false;
    offset: number = 0;
    point: number = 0.5;

    public get color(): string {
        return this.hexcolor + ('00' + (255-this.transparency).toString(16)).substr(-2);
    }

    public set color(value: string) {
        this.hexcolor = value;
    }
}
