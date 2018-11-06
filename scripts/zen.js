export default class Zen {
    constructor() {

    }

    compare(parent, child) {
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

        const completeSteps = childPathDistance / childStepRelativePathDistance;

        const results = {
            childPathRadius,
            childPathDistance,
            childStepDistance,
            childStepParentRadians,
            childStepPathDistance,
            parentStepChildDistance,
            childStepRelativePathDistance,
            completeSteps,
        };



        return results;
    }
}