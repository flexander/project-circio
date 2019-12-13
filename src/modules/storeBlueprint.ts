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
        'polygons': this.makePolygons,
        'polygonsB': this.makePolygonsB,
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

    protected makePolygons(): CircInterface {
        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const poly0 = new Polygon();
        poly0.steps = 500;
        poly0.outside = true;
        poly0.fixed = true;
        poly0.clockwise = false;
        poly0.stepMod = 0;
        poly0.startAngle = 0;
        poly0.faces = 300;
        poly0.faceWidth = 0.5;

        const poly1 = new Polygon();
        poly1.steps = 500;
        poly1.outside = true;
        poly1.fixed = true;
        poly1.clockwise = true;
        poly1.stepMod = 0;
        poly1.startAngle = 0;
        poly1.faces = 3;
        poly1.faceWidth = 100;

        const poly2 = new Polygon();
        poly2.steps = 500;
        poly2.outside = true;
        poly2.fixed = true;
        poly2.clockwise = false;
        poly2.stepMod = 0;
        poly2.startAngle = 0;
        poly2.faces = 600;
        poly2.faceWidth = 0.5;

        const poly3 = new Polygon();
        poly3.steps = 500;
        poly3.outside = true;
        poly3.fixed = true;
        poly3.clockwise = true;
        poly3.stepMod = 0;
        poly3.startAngle = 0;
        poly3.faces = 6;
        poly3.faceWidth = 100;

        const circle1Brush = new Brush();
        circle1Brush.color = '#FFFFFF';
        circle1Brush.degrees = 0;
        circle1Brush.link = false;
        circle1Brush.offset = 0;
        circle1Brush.point = 0.5;

        poly3.addBrush(circle1Brush);
        circ.addShape(poly0);
        circ.addShape(poly1);
        circ.addShape(poly2);
        circ.addShape(poly3);

        return circ;
    }

    protected makePolygonsB(): CircInterface {
        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#000000';

        const poly0 = new Polygon();
        poly0.steps = 0;
        poly0.outside = true;
        poly0.fixed = true;
        poly0.clockwise = false;
        poly0.stepMod = 0;
        poly0.startAngle = 0;
        poly0.faces = 500;
        poly0.faceWidth = 0.5;

        const poly1 = new Polygon();
        poly1.steps = 500;
        poly1.outside = true;
        poly1.fixed = true;
        poly1.clockwise = true;
        poly1.stepMod = 0;
        poly1.startAngle = 0;
        poly1.faces = 2;
        poly1.faceWidth = 200;

        const poly2 = new Polygon();
        poly2.steps = 500;
        poly2.outside = true;
        poly2.fixed = true;
        poly2.clockwise = false;
        poly2.stepMod = 0;
        poly2.startAngle = 0;
        poly2.faces = 2;
        poly2.faceWidth = 200;

        const poly3 = new Polygon();
        poly3.steps = 500;
        poly3.outside = true;
        poly3.fixed = true;
        poly3.clockwise = true;
        poly3.stepMod = 0;
        poly3.startAngle = 0;
        poly3.faces = 500;
        poly3.faceWidth = 0.5;

        const brush0 = new Brush();
        brush0.color = '#93ff3c';
        brush0.degrees = 0;
        brush0.link = false;
        brush0.offset = 0;
        brush0.point = 0.5;

        const brush1 = new Brush();
        brush1.color = '#ff74ee';
        brush1.degrees = 0;
        brush1.link = false;
        brush1.offset = 0;
        brush1.point = 0.5;

        const brush2 = new Brush();
        brush2.color = '#FFFFFF';
        brush2.degrees = 0;
        brush2.link = false;
        brush2.offset = 0;
        brush2.point = 0.5;

        //poly1.addBrush(brush0);
        //poly1.addBrush(brush1);
        poly3.addBrush(brush2);
        circ.addShape(poly0);
        circ.addShape(poly1);
        circ.addShape(poly2);
        circ.addShape(poly3);

        return circ;
    }
}
