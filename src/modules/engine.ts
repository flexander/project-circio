import {
    BrushConfigInterface,
    CircInterface,
    EngineConfigInterface,
    EngineInterface,
    EngineStateInterface,
    EventEmitter, EventInterface,
    ShapeInterface
} from "../structure";
import {AttributeChangedEvent} from "./events";

class Engine extends EventEmitter implements EngineInterface {
    public state: EngineStateInterface = new EngineState();
    protected config: EngineConfigInterface = new EngineConfig();
    protected stepCallbacks: Array<Function> = [];
    protected resetCallbacks: Array<Function> = [];
    protected importCallbacks: Array<Function> = [];
    protected circ: CircInterface;

    constructor() {
        super();

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
        this.runImportCallbacks();
    }

    public pause(): void {
        this.stepsToRun = 0;
        this.stopStepJumping();
    }

    public play(count?: number|null): void {
        this.stepsToRun = typeof count === 'number' ? count:Infinity;
    }

    public isPlaying(): boolean {
        return this.stepsToRun > 0 ||  this.state.stepJumps.length > 0;
    }

    public reset(): void {
        this.stopStepJumping();

        if (typeof this.circ !== "undefined") {
            this.circ.getShapes().forEach(shape => shape.reset());
        }

        this.runResetCallbacks();

        this.state.totalStepsRun = 0;

        // Run a single step to correctly position and render the shapes
        this.step();
    }

    protected stopStepJumping(): void {
        if (this.state.stepJumps.length === 0) {
            return;
        }

        this.state.stepJumpTimers.forEach((timeId: NodeJS.Timeout) => {
            clearTimeout(timeId);
        });

        this.state.stepJumpTimers = [];
        this.state.stepJumps = [];
        this.dispatchEvent(new EngineStepJumpEnd());
    }

    public stepFast(count: number): Promise<void> {
        if (this.state.stepJumps.length > 0) {
            throw `Step jump in progress`;
        }

        const thenContinue = this.stepsToRun;
        this.pause();

        const stepGroup = 100;
        let stepsRun = 0;

        while (stepsRun < count) {
            const stepsLeftToRun = count - stepsRun;
            const stepsToRun = (stepsLeftToRun < stepGroup) ? stepsLeftToRun:stepGroup;

            this.state.stepJumps.push(this.stepJump(stepsToRun));

            stepsRun += stepsToRun;
        }

        this.dispatchEvent(new EngineStepJumpStart());

        return Promise.all(this.state.stepJumps)
            .then(_ => {
                this.dispatchEvent(new EngineStepJumpEnd());
                this.play(thenContinue);
                this.state.stepJumps = [];
            });
    }

    protected stepJump(number: number): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            const id = setTimeout(_ => {
                for (let step = 0; step<number; step++) {
                    this.step()
                }
                resolve();
            }, 0);

            this.state.stepJumpTimers.push(id);
        });
    }

    protected calculateShapes(): void {
        if (typeof this.circ === "undefined") {
            return;
        }

        let parentShape: ShapeInterface|null = null;
        this.circ.getShapes().forEach(
            shape =>  {
                shape.calculatePosition(parentShape);

                if (shape.stepMod === 0 || this.state.totalStepsRun % shape.stepMod === 0) {
                    shape.calculateAngle();
                }

                parentShape = shape;
            });
    }

    public step(): void {
        this.state.totalStepsRun++;
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
            this.stepInterval
        );
    }

    get stepInterval(): number {
        return this.config.stepInterval;
    }

    set stepInterval(milliseconds: number) {
        this.config.stepInterval = milliseconds;
        this.dispatchEvent(new AttributeChangedEvent('stepInterval', this.stepInterval));
    }

    get stepsToRun(): number {
        return this.config.stepsToRun;
    }

    set stepsToRun(steps: number) {
        const stepsChangedBy = Math.abs(this.config.stepsToRun-steps);
        this.config.stepsToRun = steps;

        this.dispatchEvent(new AttributeChangedEvent('stepsToRun', this.stepsToRun));

        if (stepsChangedBy !== 0) {
            if (steps > 0) {
                this.dispatchEvent(new EnginePlayEvent());
            } else if (steps === 0) {
                this.dispatchEvent(new EnginePauseEvent());
            }
        }
    }
}

class EngineConfigDefault implements EngineConfigInterface {
    stepInterval: number = 1;
    stepsToRun: number = 0;

    constructor() {
        if (new.target === EngineConfigDefault) {
            Object.freeze(this);
        }
    }

}

class EngineConfig extends EngineConfigDefault implements EngineConfigInterface {
}

class EngineState implements EngineStateInterface {
    totalStepsRun: number = 0;
    stepJumps: Promise<void>[] = [];
    stepJumpTimers: NodeJS.Timeout[] = [];
}

class EnginePauseEvent implements EventInterface {
    getName(): string {
        return "pause";
    }

    getContext(): any[] {
        return [];
    }
}

class EnginePlayEvent implements EventInterface {
    getName(): string {
        return "play";
    }

    getContext(): any[] {
        return [];
    }
}

class EngineStepJumpStart implements EventInterface {
    getName(): string {
        return "stepJump.start";
    }

    getContext(): any[] {
        return [];
    }
}

class EngineStepJumpEnd implements EventInterface {
    getName(): string {
        return "stepJump.end";
    }

    getContext(): any[] {
        return [];
    }
}

export {
    Engine,
    EngineConfig,
    EngineConfigDefault,
    EnginePlayEvent,
    EnginePauseEvent,
    EngineStepJumpStart,
    EngineStepJumpEnd,
}
