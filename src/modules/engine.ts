import {CircInterface, EngineInterface, ShapeInterface} from "../structure";

export default class Engine implements EngineInterface {
    protected totalStepsRun: number = 0;
    protected interval: number = 1;
    protected stepCallbacks: Array<Function> = [];
    protected resetCallbacks: Array<Function> = [];
    protected importCallbacks: Array<Function> = [];
    protected circ: CircInterface;
    protected stepsToRun: number = 0;

    constructor() {
        this.run();
    }

    public addStepCallback(callback: Function): void {
        this.stepCallbacks.push(callback);
    }

    public addResetCallback(callback: Function): void {
        this.resetCallbacks.push(callback);
    }

    public addImportCallback(callback: Function): void {
        this.importCallbacks.push(callback);
    }

    public export(): CircInterface {
        return this.circ;
    }

    public import(circ: CircInterface): void {
        this.circ = circ;
        this.reset();
        this.runImportCallbacks()
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

    public getRemainingStepsToRun(): number {
        return this.stepsToRun;
    }

    public reset(): void {
        this.circ.getShapes().forEach(shape => shape.reset());
        this.runResetCallbacks();

        this.totalStepsRun = 0;

        // Run a single step to correctly position and render the shapes
        this.step();
    }

    public stepFast(count: number): void {
        const thenContinue = this.getRemainingStepsToRun();
        this.pause();

        for (let step = 0; step<count; step++) {
            this.step()
        }

        this.play(thenContinue);
    }

    protected calculateShapes(): void {
        let parentShape: ShapeInterface|null = null;
        this.circ.getShapes().forEach(
            shape =>  {
                shape.calculatePosition(parentShape);

                if (shape.stepMod === 0 || this.totalStepsRun % shape.stepMod === 0) {
                    shape.calculateAngle();
                }

                parentShape = shape;
            });
    }

    public step(): void {
        this.totalStepsRun++;
        this.calculateShapes();

        this.runStepCallbacks();
    }

    protected runStepCallbacks(): void {
        this.stepCallbacks.forEach(callable => {
            callable(this.circ);
        })
    }

    protected runResetCallbacks(): void {
        this.resetCallbacks.forEach(callable => {
            callable();
        })
    }

    protected runImportCallbacks(): void {
        this.importCallbacks.forEach(callable => {
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

    getStepInterval(): number {
        return this.interval;
    }

    setStepInterval(milliseconds: number): void {
        this.interval = milliseconds;
    }
}
