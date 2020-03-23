import {BrushConfigInterface, BrushInterface, EventEmitter} from "../structure";
import {AttributeChangedEvent} from "./events";

class Brush extends EventEmitter implements BrushInterface {
    protected config: BrushConfigInterface = new BrushConfig();
    
    get color(): string {
        return this.config.color;
    }
    
    set color(color: string) {
        this.config.color = color;
        this.dispatchEvent(new AttributeChangedEvent('color', this.color));
    }
    
    get transparency(): number {
        return this.config.transparency;
    }
    
    set transparency(transparency: number) {
        this.config.transparency = transparency;
        this.dispatchEvent(new AttributeChangedEvent('transparency', this.transparency));
    }
    
    get degrees(): number {
        return this.config.degrees;
    }
    
    set degrees(degrees: number) {
        this.config.degrees = degrees;
        this.dispatchEvent(new AttributeChangedEvent('degrees', this.degrees));
    }
    
    get draw(): boolean {
        return this.config.draw;
    }
    
    set draw(draw: boolean) {
        this.config.draw = draw;
        this.dispatchEvent(new AttributeChangedEvent('draw', this.draw));
    }
    
    get link(): boolean {
        return this.config.link;
    }
    
    set link(link: boolean) {
        this.config.link = link;
        this.dispatchEvent(new AttributeChangedEvent('link', this.link));
    }
    
    get offset(): number {
        return this.config.offset;
    }
    
    set offset(offset: number) {
        this.config.offset = offset;
        this.dispatchEvent(new AttributeChangedEvent('offset', this.offset));
    }
    
    get point(): number {
        return this.config.point;
    }
    
    set point(point: number) {
        this.config.point = point;
        this.dispatchEvent(new AttributeChangedEvent('point', this.point));
    }

    get colorWithAlpha(): string {
        return this.config.colorWithAlpha;
    }
}

class BrushConfigDefault implements BrushConfigInterface {
    color: string = '#FFFFFF';
    degrees: number = 0;
    draw: boolean = true;
    link: boolean = true;
    offset: number = 0;
    point: number = 0.5;
    transparency: number = 0;

    constructor() {
        if (new.target === BrushConfigDefault) {
            Object.freeze(this);
        }
    }

    get colorWithAlpha(): string {
        return this.color + ('00' + (255-this.transparency).toString(16)).substr(-2);
    }
}

class BrushConfig extends BrushConfigDefault implements BrushConfigInterface {
}

export {
    Brush,
    BrushConfig,
    BrushConfigDefault,
}
