/** Data **/

interface PositionInterface {
    x: number;
    y: number;
}

interface CircInterface {
    width: number;
    height: number;
    backgroundFill: string;
    stepsToComplete: number;
    shapes: ShapeInterface[];
    state: CircStateInterface;
}

interface CircStateInterface {
    totalSteps: number;
}

interface ShapeInterface {
    id: number;
    steps: number;
    outside: boolean;
    fixed: boolean;
    clockwise: boolean;
    stepMod: number;
    startAngle: number;
    brushes: BrushInterface[];
    state: ShapeStateInterface;
}

interface ShapeStateInterface {
    totalAngle: number;
    centre: PositionInterface;
    drawPoint: PositionInterface;
    getAngle(): number;
}

interface CircleInterface extends ShapeInterface {
    radius: number;
}

interface BrushInterface {
    draw: boolean;
    color: string;
    point: number;
    offset: number;
    degrees: number;
    link: boolean;
}

/** Engine **/

interface EngineInterface {
    import(circ: CircInterface): void;
    export(): CircInterface;

    addCallback(callback: CallableFunction): void
    pause(): void;
    play(): void
    stepBy(count: number): void
    step(): void;
    reset(): void
}


/** Paint **/

interface PainterInterface {
    constructor(canvasContext: CanvasRenderingContext2D): void;

    draw(circ: CircInterface): void;
    clear(): void;
    exportImageAsDataURL(): string;
}

interface CirclePainter extends Painter {}
interface GuidePainter extends Painter {
    hide(): void;
    show(): void;
}


/** Store
 *
 * The idea is that you can have multiple stores:
 *
 * class LocalStorage implements CircStore {...}
 * class CloudStorage implements CircStore {...}
 *
**/

interface CircStore {
    get(name: string): Circ
    getIndex(index: number): Circ
    list(): Circ[];
    store(name: string, circ: Circ): void;
}

interface BluePrints extends CircStore {}







/** Load & Run Example **/

const circPainter = new CirclePainter();
const guidePainter = new GuidePainter();
const engine = new Engine();
const store = new LocalStorage();
const circ = store.get('circ');

engine.import(circ);
engine.addCallback(circ => circPainter.draw(circ));
engine.addCallback(circ => guidePainter.draw(circ));
engine.run();

