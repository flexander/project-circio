import {CircInterface, CircStoreInterface} from "../structure";
import {Circ} from "./circ";
import {Circle} from "./circle";
import {Brush} from "./brushes";

export class BlueprintStore implements CircStoreInterface {
    protected blueprintsStore: {[name: string]: Function} = {
        'twoCircles': this.makeTwoCircles,
        'threeCircles': this.makeThreeCircles,
        'fourCircles': this.makeFourCircles,
    };

    public name: string = 'Blueprints';

    public get(name: string): Promise<CircInterface> {
        return new Promise((resolve, reject) => {
            resolve(this.resolveCirc(name));
        });
    }

    public getIndex(index: number): Promise<CircInterface> {
        return new Promise((resolve, reject) => {
            resolve(undefined);
        });
    }

    public list(): Promise<CircInterface[]> {
        return new Promise((resolve, reject) => {
            const circs = [];

            for (let circName in this.blueprintsStore) {
                circs.push(this.resolveCirc(circName));
            }

            resolve(circs);
        });
    }

    private resolveCirc(circName: string): CircInterface {
        const circ = this.blueprintsStore[circName]();
        circ.name = circName;

        return circ;
    }

    public store(name: string, circ: CircInterface): void {
    }

    public delete(name: string): void {
        throw new Error("Blueprints can't be deleted.");
    }

    protected makeTwoCircles(): CircInterface {
        const circ = new Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const circle0 = new Circle();
        circle0.steps = 500;
        circle0.clockwise = false;
        circle0.radius = 300;

        const circle1 = new Circle();
        circle1.steps = 500;
        circle1.radius = 100;

        const circle1Brush = new Brush();

        circle1.addBrush(circle1Brush);

        circ.addShape(circle0);
        circ.addShape(circle1);

        return circ;
    }

    protected makeThreeCircles(): CircInterface {
        const circ = new Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const circle0 = new Circle();
        circle0.steps = 500;
        circle0.clockwise = false;
        circle0.radius = 100;

        const circle1 = new Circle();
        circle1.steps = 500;
        circle1.radius = 50;

        const circle2 = new Circle();
        circle2.steps = 500;
        circle2.clockwise = false;
        circle2.radius = 25;

        const circle2Brush = new Brush();

        circle2.addBrush(circle2Brush);

        circ.addShape(circle0);
        circ.addShape(circle1);
        circ.addShape(circle2);

        return circ;
    }

    protected makeFourCircles(): CircInterface {
        const circ = new Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const circle0 = new Circle();
        circle0.steps = 1000;
        circle0.outside = false;
        circle0.clockwise = false;
        circle0.radius = 120;

        const circle1 = new Circle();
        circle1.steps = 500;
        circle1.radius = 60;

        const circle2 = new Circle();
        circle2.steps = 250;
        circle2.clockwise = false;
        circle2.radius = 30;

        const circle3 = new Circle();
        circle3.steps = 125;
        circle3.radius = 15;

        const circle3Brush = new Brush();

        circle3.addBrush(circle3Brush);

        circ.addShape(circle0);
        circ.addShape(circle1);
        circ.addShape(circle2);
        circ.addShape(circle3);

        return circ;
    }
}
