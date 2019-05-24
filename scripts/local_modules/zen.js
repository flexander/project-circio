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
        const childPathRadius = math.add(parent.radius, math.multiply(child.radius, childSignOutside));
        const childPathDistance = math.multiply(2, math.pi, childPathRadius);

        // Calculations based on the child rotating a single step
        const childStepDistance = child.getArc();
        const childStepParentRadians = math.fraction(childStepDistance / parent.radius);
        const childStepPathDistance = math.multiply(childStepParentRadians, childPathRadius, childSignRoll);
        const parentStepChildDistance = math.multiply(parent.getStepRadians(), childPathRadius, parentSignClockwise);
        const childStepRelativePathDistance = math.add(childStepPathDistance, parentStepChildDistance);

        // Calculate the steps for one roll around parent circumference
        let rollingSteps = 0;
        if(childStepRelativePathDistance !== 0) {
            rollingSteps = math.fraction(childPathDistance / childStepRelativePathDistance);
        }

        // Calculate total radians after one complete roll
        const parentRadiansAfterRoll = math.multiply(parent.getStepRadians(), rollingSteps, parentSignClockwise);
        const childRadiansAfterRoll = math.multiply(child.getStepRadians(), rollingSteps, childSignClockwise);
        const RollingRadiansAfterRoll = math.multiply(childStepParentRadians, rollingSteps, childSignRoll);
        const totalRollRadians = math.add(parentRadiansAfterRoll, childRadiansAfterRoll, RollingRadiansAfterRoll);
        const totalRoll = math.divide(totalRollRadians, math.fraction(math.multiply(2, math.pi)));
        //const rotationSteps = math.multiply(ratioSteps, minSteps);
        const totalRollSimple = math.number(totalRoll);

        const results = {
            rollingSteps,
            //rotationSteps,
            totalRoll,
            totalRollSimple,
        };

        return results;
    }
}
