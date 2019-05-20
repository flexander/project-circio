import math from 'mathjs';

export default class Zen {
    constructor (engine) {
        if (typeof engine === "undefined") {
            throw "Please create an engine";
        }

        this.engine = engine;
    }

    compare (parentId, childId) {
        if(isNaN(parentId) || isNaN(childId)) {
            throw "Please provide a parent and child ID";
        }

        if(typeof this.engine.list[parentId] === "undefined") {
            throw "Parent not found";
        }

        if(typeof this.engine.list[childId] === "undefined") {
            throw "Child not found";
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
        const childStepParentRadians = math.fraction(childStepDistance / parent.radius);
        const childStepPathDistance = childStepParentRadians * childPathRadius * childSignRoll;
        const parentStepChildDistance = parent.getStepRadians() * childPathRadius * parentSignClockwise;
        const childStepRelativePathDistance = childStepPathDistance + parentStepChildDistance;

        // Calculate the steps for one roll around parent circumference
        let rollingSteps = 0;
        if(childStepRelativePathDistance !== 0) {
            rollingSteps = math.fraction(childPathDistance / childStepRelativePathDistance);
        }

        // Calculate total radians after one complete roll
        const parentRadiansAfterRoll = math.multiply(math.multiply(parent.getStepRadians(), rollingSteps),parentSignClockwise);
        const childRadiansAfterRoll = math.multiply(math.multiply(child.getStepRadians(), rollingSteps),childSignClockwise);
        const RollingRadiansAfterRoll = math.multiply(math.multiply(childStepParentRadians, rollingSteps), childSignRoll);
        const totalRollRadians = math.add(parentRadiansAfterRoll, childRadiansAfterRoll, RollingRadiansAfterRoll);
        const totalRoll = math.divide(totalRollRadians, math.fraction(math.multiply(2, math.PI)));
        const rotationSteps = ratioSteps * minSteps;

        const results = {
            rollingSteps,
            totalRoll,
            rotationSteps,
        };

        return results;
    }
}
