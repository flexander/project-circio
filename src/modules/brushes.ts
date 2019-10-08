import {BrushConfigInterface, BrushInterface, EventEmitter, ShapeConfigInterface} from "../structure";
import {AttributeChangedEvent} from "./events";
import {CircleConfig} from "./circle";

class Brush extends EventEmitter implements BrushInterface {
    protected config: BrushConfigInterface = new BrushConfig();
    
    get color(): string {
        return this.config.color;
    }
    
    set color(color: string) {
        this.config.color = color;
    }
    
    get transparency(): number {
        return this.config.transparency;
    }
    
    set transparency(transparency: number) {
        this.config.transparency = transparency;
    }
    
    get degrees(): number {
        return this.config.degrees;
    }
    
    set degrees(degrees: number) {
        this.config.degrees = degrees;
    }
    
    get draw(): boolean {
        return this.config.draw;
    }
    
    set draw(draw: boolean) {
        this.config.draw = draw;
    }
    
    get link(): boolean {
        return this.config.link;
    }
    
    set link(link: boolean) {
        this.config.link = link;
    }
    
    get offset(): number {
        return this.config.offset;
    }
    
    set offset(offset: number) {
        this.config.offset = offset;
    }
    
    get point(): number {
        return this.config.point;
    }
    
    set point(point: number) {
        this.config.point = point;
    }

    get colorWithAlpha(): string {
        return this.config.colorWithAlpha;
    }
}

class BrushConfig {
    color: string = '#FFFFFF';
    transparency: number = 0;
    degrees: number = 0;
    draw: boolean = true;
    link: boolean = false;
    offset: number = 0;
    point: number = 0.5;

    get colorWithAlpha(): string {
        return this.color + ('00' + (255-this.transparency).toString(16)).substr(-2);
    }
}

export {
    Brush,
    BrushConfig,
}
