import {CircInterface, CircStoreInterface} from "../structure";
import {Circle} from "./circle";
import {Brush} from "./brushes";
import {Circ} from "./circ";

export class StoreRandom implements CircStoreInterface {
    public name: string = 'Randomiser';

    public get(name: string): Promise<CircInterface> {
        return new Promise((resolve, reject) => {
            const circ = this.makeCirc();
            circ.name = 'Random Circ';
            resolve(circ);
        });
    }

    public getIndex(index: number): Promise<CircInterface> {
        return this.get(index.toString());
    }

    public list(): Promise<CircInterface[]> {
        return new Promise((resolve, reject) => {
            const circs = [];

            for (let i=0;i<5;i++) {
                const circ = this.makeCirc();
                circ.name = `Random Circ ${i+1}`;
                circs.push(circ);
            }

            resolve(circs);
        });
    }

    public store(name: string, circ: CircInterface): void {
    }

    public delete(name: string): void {
        throw new Error("Blueprints can't be deleted.");
    }

    protected getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    protected getRandomBool(): boolean {
        return this.getRandomInt(0,1) === 1;
    }

    protected makeCirc(): CircInterface {
        let j = 0;
        while(j++ < 500) {

            const pr = this.getRandomInt(10, 200);
            const cr = this.getRandomInt(10, 200);
            const ratio = pr / cr;
            let multiple;

            for (let i = 0; i < 10; i++) {
                // console.log(pr,cr,i);
                if ((ratio * i) % 1 === 0) {
                    multiple = i;
                    continue;
                }

                multiple = null;
            }

            if (multiple !== null) {
                console.warn(pr,cr,multiple);
            }
        }

        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const shapes = this.getRandomInt(2,4);
        const multiple = this.getRandomInt(2,10);

        for (let i=0;i<shapes;i++) {
            const circle = new Circle();
            circle.steps = this.getRandomInt(10,100) * multiple;
            circle.outside = this.getRandomBool();
            circle.fixed = true;
            circle.clockwise = this.getRandomBool();
            circle.stepMod = 0;
            circle.startAngle = 0;
            circle.radius = this.getRandomInt(10,100) * multiple;

            circ.addShape(circle);
        }

        const brush = new Brush();
        brush.color = '#FFFFFF';
        brush.degrees = 0;
        brush.link = this.getRandomBool();
        brush.offset = 0;
        brush.point = 0.5;

        circ.getShapes()[circ.getShapes().length-1].getBrushes().push(brush);

        return circ;
    }
}
