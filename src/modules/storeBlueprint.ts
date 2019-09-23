import {CircInterface, CircStoreInterface} from "../structure";
import {CircleFactory} from "./circle";
import Brush from "./brushes";
import Circ from "./circ";

export class BlueprintStore implements CircStoreInterface {
    protected blueprintsStore: {[name: string]: Function} = {
        'twoCircles': this.makeTwoCircles,
        'threeCircles': this.makeThreeCircles,
        'fourCircles': this.makeFourCircles,
    };

    public get(name: string): CircInterface {
        return this.blueprintsStore[name]();
    }

    public getIndex(index: number): CircInterface {
        return undefined;
    }

    public list(): CircInterface[] {
        return [];
    }

    public store(name: string, circ: CircInterface): void {
    }

    public delete(name: string): void {
        throw new Error("Blueprints can't be deleted.");
    }

    protected makeTwoCircles(): CircInterface {
        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const circle0 = CircleFactory();
        circle0.steps = 500;
        circle0.outside = false;
        circle0.fixed = true;
        circle0.clockwise = false;
        circle0.stepMod = 0;
        circle0.startAngle = 0;
        circle0.radius = 300;

        const circle1 = CircleFactory();
        circle1.steps = 500;
        circle1.outside = true;
        circle1.fixed = true;
        circle1.clockwise = true;
        circle1.stepMod = 0;
        circle1.startAngle = 0;
        circle1.radius = 100;

        const circle1Brush = new Brush();
        circle1Brush.color = '#FFFFFF';
        circle1Brush.degrees = 0;
        circle1Brush.link = false;
        circle1Brush.offset = 0;
        circle1Brush.point = 0.5;

        circle1.brushes.push(circle1Brush);

        circ.addShape(circle0);
        circ.addShape(circle1);

        return circ;
    }

    protected makeThreeCircles(): CircInterface {
        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const circle0 = CircleFactory();
        circle0.steps = 500;
        circle0.outside = false;
        circle0.fixed = true;
        circle0.clockwise = false;
        circle0.stepMod = 0;
        circle0.startAngle = 0;
        circle0.radius = 100;

        const circle1 = CircleFactory();
        circle1.steps = 500;
        circle1.outside = true;
        circle1.fixed = true;
        circle1.clockwise = true;
        circle1.stepMod = 0;
        circle1.startAngle = 0;
        circle1.radius = 50;

        const circle2 = CircleFactory();
        circle2.steps = 500;
        circle2.outside = true;
        circle2.fixed = true;
        circle2.clockwise = false;
        circle2.stepMod = 0;
        circle2.startAngle = 0;
        circle2.radius = 25;

        const circle2Brush = new Brush();
        circle2Brush.color = '#FFFFFF';
        circle2Brush.degrees = 0;
        circle2Brush.link = false;
        circle2Brush.offset = 0;
        circle2Brush.point = 0.5;

        circle2.brushes.push(circle2Brush);

        circ.addShape(circle0);
        circ.addShape(circle1);
        circ.addShape(circle2);

        return circ;
    }

    protected makeFourCircles(): CircInterface {
        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        const circle0 = CircleFactory();
        circle0.steps = 1000;
        circle0.outside = false;
        circle0.fixed = true;
        circle0.clockwise = false;
        circle0.stepMod = 0;
        circle0.startAngle = 0;
        circle0.radius = 120;

        const circle1 = CircleFactory();
        circle1.steps = 500;
        circle1.outside = true;
        circle1.fixed = true;
        circle1.clockwise = true;
        circle1.stepMod = 0;
        circle1.startAngle = 0;
        circle1.radius = 60;

        const circle2 = CircleFactory();
        circle2.steps = 250;
        circle2.outside = true;
        circle2.fixed = true;
        circle2.clockwise = false;
        circle2.stepMod = 0;
        circle2.startAngle = 0;
        circle2.radius = 30;

        const circle3 = CircleFactory();
        circle3.steps = 125;
        circle3.outside = true;
        circle3.fixed = true;
        circle3.clockwise = true;
        circle3.stepMod = 0;
        circle3.startAngle = 0;
        circle3.radius = 15;

        const circle3Brush = new Brush();
        circle3Brush.color = '#FFFFFF';
        circle3Brush.degrees = 0;
        circle3Brush.link = false;
        circle3Brush.offset = 0;
        circle3Brush.point = 0.5;

        circle3.brushes.push(circle3Brush);

        circ.addShape(circle0);
        circ.addShape(circle1);
        circ.addShape(circle2);
        circ.addShape(circle3);

        return circ;
    }
}