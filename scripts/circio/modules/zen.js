import math from 'mathjs';

export default class Zen {
    constructor (engine) {
        if (typeof engine === "undefined") {
            throw "Please create an engine";
        }

        this.engine = engine;
    }

    compare (parentId, childId) {
        if(Number.isNaN(parentId) || Number.isNaN(childId)) {
            return false;
        }

        // Pair of circles
        const parent = this.engine.list[parentId];
        const child = this.engine.list[childId];

        // Core numbers for calculations
        const parentSteps = parent.steps;
        const childSteps = child.steps;
        const minSteps = Math.min(parentSteps, childSteps);
        const maxSteps = Math.max(parentSteps, childSteps);
        const ratioSteps = math.fraction(maxSteps / minSteps);

        // Signs based on direction and position
        const childSignOutside = child.outside === true ? 1: -1;
        const childSignClockwise = child.clockwise === true ? 1: -1;
        const childSignRoll = childSignOutside * childSignClockwise;
        const parentSignClockwise = parent.clockwise === true ? 1: -1;

        // The center point of the child has a path around parent
        const childPathRadius = parent.radius + (child.radius * childSignOutside);
        const childPathDistance = 2*Math.PI*childPathRadius;

        // Calculations based on the child rotating a single step
        const childStepDistance = child.getArc();
        const childStepParentRadians = (childStepDistance / parent.radius);
        const childStepPathDistance = childStepParentRadians * childPathRadius * childSignRoll;
        const parentStepChildDistance = parent.getStepRadians() * childPathRadius * parentSignClockwise;
        const childStepRelativePathDistance = childStepPathDistance + parentStepChildDistance;

        // Calculate the minimum number of steps to complete a pattern
        let rollingSteps = 0;
        if(childStepRelativePathDistance !== 0) {
            rollingSteps = math.fraction(childPathDistance / childStepRelativePathDistance);
            rollingSteps = math.number(rollingSteps.d * rollingSteps.n);
        }
        const rotationSteps = ratioSteps * minSteps;
        const stepsLCM = this.LCM(rollingSteps, rotationSteps);
        const zenSteps = stepsLCM;

        //TODO: work out if child has rotated back to original position

        const results = {
            childPathDistance: childPathDistance,
            childStepPathDistance: childStepPathDistance,
            childStepRelativePathDistance: childStepRelativePathDistance,
            ratioSteps: ratioSteps,
            parentSteps: parent.steps,
            childSteps: child.steps,
            rollingSteps: rollingSteps,
            rotationSteps: rotationSteps,
            zenSteps: zenSteps,
        };

        return results;
    }

    // greatestCommonDenominator
    GCD (x, y) {
        if (!y) return x;
        return this.LCM(y, x % y);
    };

    //largest common multiple
    LCM (x, y) {
        return (!x || !y) ? 0 : Math.abs((x * y) / this.GCD(x, y));
    }
}