import math from 'mathjs';

export default class Zen {
    constructor() {
    }

    compare(parent, child) {
        const parentSteps = parent.steps;
        const childSteps = child.steps;
        const minSteps = Math.min(parentSteps, childSteps);
        const maxSteps = Math.max(parentSteps, childSteps);
        const ratioSteps = maxSteps / minSteps;

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

        const rollingSteps = (childStepRelativePathDistance !== 0) ? math.fraction(childPathDistance / childStepRelativePathDistance) : 0;
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
        if ((typeof x !== 'number') || (typeof y !== 'number'))
            return false;
        return (!x || !y) ? 0 : Math.abs((x * y) / this.gcd_two_numbers(x, y));
    }
}