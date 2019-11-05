import {CircInterface, CircStoreInterface} from "../structure";
import {Circ} from "./circ";
import {Circle} from "./circle";
import {Brush} from "./brushes";
import {Polygon} from "./polygon";

export class BlueprintStore implements CircStoreInterface {
    protected blueprintsStore: {[name: string]: Function} = {
        'twoCircles': this.makeTwoCircles,
        'threeCircles': this.makeThreeCircles,
        'fourCircles': this.makeFourCircles,
        'twoSquares': this.makeTwoSquares,
        'twoPolygons': this.makeTwoPolygons,
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

    protected makeTwoSquares(): CircInterface {
        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const square0 = new Polygon();
        square0.steps = 1000;
        square0.outside = true;
        square0.fixed = true;
        square0.clockwise = false;
        square0.stepMod = 0;
        square0.startAngle = 0;
        square0.faces = 4;
        square0.faceWidth = 200;

        const square1 = new Polygon();
        square1.steps = 1000;
        square1.outside = true;
        square1.fixed = true;
        square1.clockwise = false;
        square1.stepMod = 0;
        square1.startAngle = 0;
        square1.faces = 4;
        square1.faceWidth = 75;

        const circle1Brush = new Brush();
        circle1Brush.color = '#FFFFFF';
        circle1Brush.degrees = 0;
        circle1Brush.link = false;
        circle1Brush.offset = 0;
        circle1Brush.point = 0.5;

        square0.addBrush(circle1Brush);
        circ.addShape(square0);
        circ.addShape(square1);

        return circ;
    }

    protected makeTwoPolygons(): CircInterface {
        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const poly0 = new Polygon();
        poly0.steps = 0;
        poly0.outside = true;
        poly0.fixed = true;
        poly0.clockwise = true;
        poly0.stepMod = 0;
        poly0.startAngle = 0;
        poly0.faces = 5;
        poly0.faceWidth = 200;

        const poly1 = new Polygon();
        poly1.steps = 20;
        poly1.outside = true;
        poly1.fixed = true;
        poly1.clockwise = true;
        poly1.stepMod = 0;
        poly1.startAngle = 0;
        poly1.faces = 4;
        poly1.faceWidth = 75;

        const circle1Brush = new Brush();
        circle1Brush.color = '#FFFFFF';
        circle1Brush.degrees = 0;
        circle1Brush.link = false;
        circle1Brush.offset = 0;
        circle1Brush.point = 0.5;

        poly1.addBrush(circle1Brush);
        circ.addShape(poly0);
        circ.addShape(poly1);

        return circ;
    }
}
