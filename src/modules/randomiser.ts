import {Circ} from "./circ";
import {Circle, CircleConfig} from "./circle";
import {Brush} from "./brushes";
import {
    BooleanGeneratorInterface,
    CircGeneratorInterface,
    CircInterface,
    CircleConfigGeneratorInterface,
    CircleConfigInterface,
    NumberGeneratorInterface,
    ShapeConfigGeneratorInterface,
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

    public make(shapeConfigGenerators: ShapeConfigGeneratorInterface[]): Promise<CircInterface> {
        if (typeof this.randomSeed !== 'undefined') {
            seedrandom(this.randomSeed, {global: true})
        }

        return new Promise((resolve, reject) => {
            if (typeof this.randomSeed !== 'undefined') {
                seedrandom(this.randomSeed, {global: true})
            }

            let circ: CircInterface;
            let count = 0;

            do {
                circ = new Circ();
                circ.width = 1080;
                circ.height = 1080;
                circ.backgroundFill = '#1b5eec';

                shapeConfigGenerators.forEach((shapeConfigGenerator: ShapeConfigGeneratorInterface): void => {
                    if (shapeConfigGenerator instanceof CircleConfigGenerator) {
                        const config = shapeConfigGenerator.make();
                        const circle = Circle.fromConfig(config);
                        circ.addShape(circle);
                        return;
                    }

                    throw `Unable to create shape from config of type: ${shapeConfigGenerator.constructor.name}`;
                });
            } while (circ.stepsToComplete > this.maxSteps);

            circ.getLastShape().addBrush(new Brush());

            if (typeof this.randomSeed !== "undefined") {
                console.log(`found a valid seed: ${this.randomSeed}${count}`)
            }

            resolve(circ);
        });
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


const rootCircle = new CircleConfigGenerator();
rootCircle.radiusGenerator = new NumberGenerator(150, 250);
rootCircle.stepGenerator = new NumberGenerator(0,0);

const threeCircleConfigGenerators = [
    rootCircle,
    new CircleConfigGenerator,
    new CircleConfigGenerator,
];

export {
    Randomiser,
    NumberGenerator,
    CircleConfigGenerator,
    BooleanGenerator,
    threeCircleConfigGenerators,
};
