import math from 'mathjs';

export default class Zen {
    constructor() {
    }

    compare(parent, child) {
        const parentSteps = parent.steps;
        const childSteps = child.steps;
        const minSteps = Math.min(parentSteps, childSteps);
        const maxSteps = Math.max(parentSteps, childSteps);
        const ratioSteps = math.fraction(maxSteps / minSteps);

        const childSignOutside = child.outside === true ? 1: -1;
        const childSignClockwise = child.clockwise === true ? 1: -1;
        const childSignRoll = childSignOutside * childSignClockwise;
        const parentSignClockwise = parent.clockwise === true ? 1: -1;

        const childPathRadius = parent.radius + (child.radius * childSignOutside);
        const childPathDistance = 2*Math.PI*childPathRadius;

        const childStepDistance = child.getArc();
        const childStepParentRadians = (childStepDistance / parent.radius);

        const childStepPathDistance = childStepParentRadians * childPathRadius * childSignRoll;
        const parentStepChildDistance = parent.getStepRadians() * childPathRadius * parentSignClockwise;

        const childStepRelativePathDistance = childStepPathDistance + parentStepChildDistance;

        let rollingSteps = 0;
        if(childStepRelativePathDistance !== 0) {
            rollingSteps = math.fraction(childPathDistance / childStepRelativePathDistance);
            rollingSteps = math.number(rollingSteps.d * rollingSteps.n);
        }

        const rotationSteps = ratioSteps * minSteps;

        const zenSteps = this.lcm_two_numbers(rollingSteps, rotationSteps);

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

    gcd_two_numbers(x, y) {
        if (!y) return x;

        return this.gcd_two_numbers(y, x % y);
    };

    lcm_two_numbers(x, y) {
        console.log(this.gcd_two_numbers(x, y));
        return (!x || !y) ? 0 : Math.abs((x * y) / this.gcd_two_numbers(x, y));
    }
}