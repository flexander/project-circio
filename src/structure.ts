/** Data **/

interface PositionInterface {
    x: number;
    y: number;
}

interface CircInterface {
    name: string;
    width: number;
    height: number;
    backgroundFill: string;
    stepsToComplete: number;
    state: CircStateInterface;

    addShape(shape: ShapeInterface): void;
    getShapes(): ShapeInterface[];
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
    isRoot: boolean;

    calculatePosition(parentCircle: ShapeInterface|null): void;
    calculateAngle(): void;
    reset(): void;
}

interface ShapeStateInterface {
    totalAngle: number;
    centre: PositionInterface;
    drawPoint: PositionInterface;
    initialState: ShapeStateInterface;
    previousState: ShapeStateInterface;

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

    addStepCallback(callback: CallableFunction): void
    addResetCallback(callback: CallableFunction): void
    addImportCallback(callback: CallableFunction): void
    pause(): void;
    play(count?: number|null): void
    stepFast(count: number): void
    step(): void;
    reset(): void
    isPlaying(): boolean;
    getRemainingStepsToRun(): number;
    setStepInterval(milliseconds: number): void;
    getStepInterval(): number;
}


/** Paint **/

interface PainterInterface {
    draw(circ: CircInterface): void;
    clear(): void;
    exportImageAsDataURL(): string;
}

interface CirclePainterInterface extends PainterInterface {}
interface GuidePainterInterface extends PainterInterface {
    hide(): void;
    show(): void;
    isVisible(): boolean;
}
interface BackgroundPainterInterface extends PainterInterface {}


/** Store
 *
 * The idea is that you can have multiple stores:
 *
 * class LocalStorage implements CircStore {...}
 * class CloudStorage implements CircStore {...}
 *
**/

interface CircStoreInterface {
    get(name: string): CircInterface
    getIndex(index: number): CircInterface
    list(): CircInterface[];
    store(name: string, circ: CircInterface): void;
}

// interface BluePrints extends CircStoreInterface {}

/** Util **/
interface SerializerInterface {
    serialize(circ: CircInterface): string;
    unserialize(circJson: string): CircInterface;
}

/** Controls **/
interface ControlPanelInterface {
    addControl(control: ControlInterface): void;
    render(): DocumentFragment;
}

interface ControlInterface {
    render(): DocumentFragment;
}

interface QuickControlInterface {
    getQuickControls(): ControlInterface[];
}


interface CircControlInterface extends ControlInterface {}

interface ShapeControlInterface extends ControlInterface {}

interface EngineControlInterface extends ControlInterface {
    addCircControl(circControl: CircControlInterface): void;
}
interface CircleControlInterface extends ShapeControlInterface {
    addBrushControl(brush: BrushControlInterface): void;
}
interface BrushControlInterface extends ControlInterface {}
interface BackgroundControlInterface extends ControlInterface {}


/** Events **/

interface CircStructureChangedEventInterface extends CustomEvent {}
interface AttributeChangedEventInterface extends CustomEvent {
    name: string;
    value: string|number|boolean;
}

export {
    PositionInterface,
    CircInterface,
    CircStateInterface,
    ShapeInterface,
    ShapeStateInterface,
    CircleInterface,
    BrushInterface,
    EngineInterface,
    PainterInterface,
    CircStoreInterface,
    CirclePainterInterface,
    GuidePainterInterface,
    BackgroundPainterInterface,
    SerializerInterface,
    ControlPanelInterface,
    ControlInterface,
    QuickControlInterface,
    ShapeControlInterface,
    EngineControlInterface,
    CircleControlInterface,
    BrushControlInterface,
    CircControlInterface,
    BackgroundControlInterface,
}




/** Load & Run Example **/

// const circPainter = new CirclePainter();
// const guidePainter = new GuidePainter();
// const engine = new Engine();
// const store = new LocalStorage();
// const circ = store.get('circ');
//
// engine.import(circ);
// engine.addCallback(circ => circPainter.draw(circ));
// engine.addCallback(circ => guidePainter.draw(circ));
// engine.run();

