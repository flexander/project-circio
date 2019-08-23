import {CircInterface, EngineInterface, ShapeInterface} from "../structure";

export default class Engine implements EngineInterface {
    protected steps: number = 0;
    protected interval: number = 1;
    protected callbacks: Array<Function> = [];
    protected circ: CircInterface;
    protected stepsToRun: number = 0;

    constructor() {
        this.run();
    }

    public addCallback(callback: Function): void {
        this.callbacks.push(callback);
    }

    public export(): CircInterface {
        return this.circ;
    }

    public import(circ: CircInterface): void {
        this.circ = circ;
    }

    public pause(): void {
        this.stepsToRun = 0;
    }

    public play(count?: number|null): void {
        this.stepsToRun = typeof count === 'number' ? count:Infinity;
    }

    public isPlaying(): boolean {
        return this.stepsToRun > 0;
    }

    public reset(): void {
        this.circ.shapes.forEach(shape => shape.reset());
    }

    public stepFast(count: number): void {
        this.pause();

        for (let step = 0; step<count; step++) {
            this.step()
        }
    }

    protected calculateShapes(): void {
        let parentShape: ShapeInterface|null = null;
        this.circ.shapes.forEach(
            shape =>  {
                shape.calculate(parentShape);
                parentShape = shape;
            });
    }

    public step(): void {
        this.calculateShapes();

        this.runCallbacks();
    }

    protected runCallbacks(): void {
        this.callbacks.forEach(callable => {
            callable(this.circ);
        })
    }

    protected run(): void {
        setTimeout(
            _ => {
                    if (this.stepsToRun > 0) {
                        this.step();
                        this.stepsToRun--;
                    }
                    this.run();
                },
            this.interval
        );
    }

}
