import {Circ} from "./circ";
import {Circle, CircleConfig} from "./circle";
import {Brush} from "./brushes";
import {
    BooleanGeneratorInterface,
    CircGeneratorInterface,
    CircInterface,
    CircleConfigGeneratorInterface,
    CircleConfigInterface,
    CircleInterface, NumberGeneratorInterface, ShapeConfigInterface, ShapeInterface
} from "../structure";
import * as seedrandom from 'seedrandom';


class Randomiser implements CircGeneratorInterface {
    protected maxSteps = 40000;
    protected randomSeed;

    constructor(seed?: string) {
        if (typeof seed !== 'undefined') {
            this.randomSeed = seed;
            this.maxSteps = 400000;
        }
    }

    public make(shapes: ShapeConfigInterface[] = []): Promise<CircInterface> {
        return new Promise((resolve, reject) => {
            let circ: CircInterface;
            let count = 0;

            do {
                circ = this.makeCirc(shapes, `${this.randomSeed}${count++}`);
                console.log(circ.stepsToComplete);
            } while (circ.stepsToComplete > this.maxSteps);

            if (typeof this.randomSeed !== "undefined") {
                console.log(`found a valid seed: ${this.randomSeed}${count}`)
            }

            resolve(circ);
        });
    }

    protected makeCirc(shapeConfigs: ShapeConfigInterface[], seed?: string): CircInterface {
        if (typeof seed !== 'undefined') {
            seedrandom(seed, {global: true})
        }

        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';

        shapeConfigs.forEach((shapeConfig: ShapeConfigInterface): void => {
            if (shapeConfig instanceof CircleConfig) {
                circ.addShape(Circle.fromConfig(shapeConfig));

                return;
            }

            throw `Unable to create shape from config of type: ${shapeConfig.constructor.name}`;
        });

        circ.getShapes()[circ.getShapes().length - 1].addBrush(new Brush());

        return circ;
    }

    protected generate(seed?: string): CircInterface {

        const pr = this.getRandomInt(150, 250);
        const cr = this.getRandomInt(10, 250);
        const ccr = this.getRandomInt(10, 250);
        const ps = 0;
        const cs = this.getRandomInt(500, 1500);
        const ccs = this.getRandomInt(500, 1500);

        const circ = new Circ();
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';


        const circle = new Circle();
        circle.steps = ps;
        circle.radius = pr;


        const circle1 = new Circle();
        circle1.steps = cs;
        circle1.clockwise = this.getRandomBool();
        circle1.radius = cr;
        circle1.outside = circle.radius === circle1.radius ? true:this.getRandomBool();


        const circle2 = new Circle();
        circle2.steps = ccs;
        circle2.clockwise = this.getRandomBool();
        circle2.radius = ccr;
        circle2.outside = circle1.radius === circle2.radius ? true:this.getRandomBool();

        const brush = new Brush();

        circle2.addBrush(brush);

        circ.addShape(circle);
        circ.addShape(circle1);
        circ.addShape(circle2);

        const stepsToComplete = circ.stepsToComplete;

        if (stepsToComplete > this.maxSteps) {
            throw 'too many steps'
        }

        console.log(pr,cs,cr,cs,ccr,ccs,stepsToComplete);

        return circ;
    }

    protected lcm(x, y) {
        return Math.abs((x * y) / this.gcd(x, y));
    }

    protected gcd(x, y) {
        x = Math.abs(x);
        y = Math.abs(y);
        while(y) {
            var t = y;
            y = x % y;
            x = t;
        }
        return x;
    }

    protected getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    protected getRandomBool(): boolean {
        return this.getRandomInt(0,1) ? true:false;
    }

    protected getRandomHexColour(): string {
        return `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }
}

class CircleConfigGenerator implements CircleConfigGeneratorInterface {
    radiusGenerator: NumberGeneratorInterface = new NumberGenerator(10, 250);
    stepGenerator: NumberGeneratorInterface = new NumberGenerator(500, 1500);
    booleanGenerator: BooleanGeneratorInterface = new BooleanGenerator();

    make(): CircleConfigInterface {
        const circleConfig = new CircleConfig();
        circleConfig.clockwise = this.booleanGenerator.make();
        circleConfig.outside = this.booleanGenerator.make();
        circleConfig.steps = this.stepGenerator.make();
        circleConfig.radius = this.radiusGenerator.make();

        return circleConfig;
    }

}

class NumberGenerator implements NumberGeneratorInterface {
    min: number;
    max: number;

    constructor(min: number,max: number) {
        this.min = Math.ceil(min);
        this.max = Math.floor(max);
    }

    make(): number {
        return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }
}

class BooleanGenerator implements BooleanGeneratorInterface {
    make(): boolean {
        return Math.floor(Math.random() * 2) === 1;
    }
}

export {
    Randomiser,
    NumberGenerator,
    CircleConfigGenerator,
    BooleanGenerator,
};
