/** Data **/

interface Position {
    x: number;
    y: number;
}

interface Circ {
    width: number;
    height: number;
    backgroundFill: string;
    stepsToComplete: number;
    circles: Circle[];
    state: CircState;
}

interface CircState {
    totalSteps: number;
}

interface Circle {
    id: number;
    radius: number;
    steps: number;
    outside: boolean;
    fixed: boolean;
    clockwise: boolean;
    stepMod: number;
    startAngle: number;
    state: CircleState;
    brushes: Brush[];
}

interface CircleState {
    totalAngle: number;
    centre: Position;
    drawPoint: Position;
    getAngle(): number;
}

interface Brush {
    draw: boolean;
    color: string;
    point: number;
    offset: number;
    degrees: number;
    link: boolean;
}

/** Engine **/

interface Engine {
    import(circ: Circ): void;
    export(): Circ;

    addCallback(callback: CallableFunction): void
    pause(): void;
    play(): void
    step(count: number): void
    stepOnce(): void;
    reset(): void
}


/** Paint **/

interface Painter {
    constructor(canvasContext: CanvasRenderingContext2D): void;

    draw(circ: Circ): void;
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

