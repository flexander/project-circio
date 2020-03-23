"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("../structure");
var structure_1 = require("../structure");
var math = require("mathjs");
var circle_1 = require("./circle");
var events_1 = require("./events");
var cloneDeep = require('lodash.clonedeep');
var Polygon = /** @class */ (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super.call(this) || this;
        _this.brushes = [];
        _this.state = new PolygonState();
        _this.config = new PolygonConfig();
        _this.id = Math.floor(Math.random() * 100000);
        _this.saveInitialState();
        return _this;
    }
    Polygon.prototype.calculatePosition = function (parentPolygon) {
        this.savePreviousState();
        var arcToParentRadians = 0;
        var parentRadians = (parentPolygon !== null && this.fixed === true) ? parentPolygon.state.getAngle() : 0;
        var radiusRelative = 0;
        var parentCentreX = this.state.centre.x;
        var parentCentreY = this.state.centre.y;
        if (parentPolygon !== null) {
            this.parent = parentPolygon;
            parentCentreX = parentPolygon.state.centre.x;
            parentCentreY = parentPolygon.state.centre.y;
            var distanceOffset = this.getOffsetDistance();
            var distanceFromOrigin = this.getDistanceFromOriginToContact(parentPolygon);
            var distanceFromPafStart = distanceFromOrigin % parentPolygon.faceWidth;
            var parentActiveFace = Math.floor(distanceFromOrigin / parentPolygon.faceWidth);
            // calculate parent centre contact point
            var parentSAS = this.getValuesFromSAS(parentPolygon.getRadius(), // side b
            (parentPolygon.getOuterAngle() / 2), // angle A
            distanceFromPafStart // side c
            );
            var parentCentreToContactPoint = parentSAS.a;
            var angleRelativeToParent = parentActiveFace * parentPolygon.getInnerAngle();
            var contactPointAngle = parentSAS.C + angleRelativeToParent;
            // calculate child centre contact point
            var distanceFromChildCornerToContact = ((distanceFromOrigin + distanceOffset) % this.faceWidth);
            // If not on parent corner
            if (!(parentSAS.C === 0 && parentSAS.c === 0)) {
                distanceFromChildCornerToContact = this.faceWidth - distanceFromChildCornerToContact;
            }
            var childSAS = this.getValuesFromSAS(this.getRadius(), // side b
            (this.getOuterAngle() / 2), // angle A
            distanceFromChildCornerToContact // side c
            );
            var childCentreToContactPoint = childSAS.a;
            // If parentSasC = 0 then the child is on a corner
            var parentSASB = void 0;
            if (parentSAS.C === 0 && parentSAS.c === 0) {
                parentSASB = parentPolygon.getOuterAngle() / 2;
            }
            else {
                parentSASB = parentSAS.B;
            }
            var childSASB = void 0;
            if (childSAS.C === 0 && childSAS.c === 0) {
                childSASB = this.getOuterAngle() / 2;
            }
            else {
                childSASB = childSAS.B;
            }
            var relativeAngle = (this.getRadiansInCurrentRoll(parentPolygon) +
                childSASB +
                parentSASB);
            // console.log([this.getRadiansInCurrentRoll(parentPolygon),
            // childSASB,
            // parentSASB]);
            if (this.clockwise === true) {
                relativeAngle *= -1;
            }
            var relativeSAS = this.getValuesFromSAS(parentCentreToContactPoint, // side b
            relativeAngle, // angle A
            childCentreToContactPoint // side c
            );
            //console.log(relativeSAS);
            radiusRelative = relativeSAS.a;
            contactPointAngle = (this.clockwise === false) ? -(contactPointAngle) : contactPointAngle;
            var contactPointX = (parentCentreToContactPoint * Math.cos(contactPointAngle + parentPolygon.state.getAngle())) + parentCentreX;
            var contactPointY = (parentCentreToContactPoint * Math.sin(contactPointAngle + parentPolygon.state.getAngle())) + parentCentreY;
            arcToParentRadians = contactPointAngle + relativeSAS.C;
            this.state.contactPoint.x = contactPointX;
            this.state.contactPoint.y = contactPointY;
        }
        var centreRads = parentRadians + arcToParentRadians;
        this.state.centre.x = parentCentreX + (Math.cos(centreRads) * radiusRelative);
        this.state.centre.y = parentCentreY + (Math.sin(centreRads) * radiusRelative);
        // New x1 & y1 to reflect change in radians
        this.state.drawPoint.x = this.state.centre.x + (Math.cos(parentRadians + this.state.totalAngle) * this.getRadius());
        this.state.drawPoint.y = this.state.centre.y + (Math.sin(parentRadians + this.state.totalAngle) * this.getRadius());
    };
    Polygon.prototype.calculateAngle = function () {
        this.state.previousState.totalAngle = this.state.totalAngle;
        if (this.clockwise === true) {
            this.state.totalAngle += this.getStepRadians();
        }
        else {
            this.state.totalAngle -= this.getStepRadians();
        }
    };
    Polygon.prototype.savePreviousState = function () {
        this.state.previousState = cloneDeep(this.state);
        delete this.state.previousState.previousState;
    };
    Polygon.prototype.saveInitialState = function () {
        this.state.initialState = cloneDeep(this.state);
    };
    Polygon.prototype.getStepRadians = function () {
        var stepRadian = 0;
        if (this.steps > 0) {
            stepRadian = (Math.PI * 2) / this.steps;
        }
        return stepRadian;
    };
    Polygon.prototype.getStepCount = function () {
        var stepCount = 0;
        if (this.steps > 0) {
            stepCount = this.state.totalAngle / this.getStepRadians();
        }
        return stepCount;
    };
    Polygon.prototype.reset = function () {
        this.state = cloneDeep(this.state.initialState);
        // Create a new initial state object
        this.saveInitialState();
    };
    Polygon.prototype.addBrush = function (brush) {
        this.brushes.push(brush);
    };
    Polygon.prototype.getBrushes = function () {
        return this.brushes;
    };
    Polygon.prototype.getRadius = function () {
        return this.faceWidth / (2 * Math.sin(Math.PI / this.faces));
    };
    Polygon.prototype.getInRadius = function () {
        return this.faceWidth / (2 * Math.tan(Math.PI / this.faces));
    };
    Polygon.prototype.getInnerAngle = function () {
        return (2 * Math.PI) / this.faces;
    };
    Polygon.prototype.getOuterAngle = function () {
        return Math.PI - this.getInnerAngle();
    };
    Polygon.prototype.getExternalAngle = function () {
        return this.getInnerAngle();
    };
    Polygon.prototype.getRadiansPerFace = function () {
        return this.getInnerAngle();
    };
    Polygon.prototype.getRatio = function (parentPolygon) {
        return math.fraction(parentPolygon.faceWidth, this.faceWidth);
    };
    /**
     * The angle between the active parent face and
     * active child face in the start position
     *
     * @param parentPolygon
     */
    Polygon.prototype.getOffsetRadians = function (parentPolygon) {
        var offsetAngle = 0;
        // Odd number of faces
        if (this.faces % 2 !== 0) {
            offsetAngle = (Math.PI - parentPolygon.getOuterAngle()) / 2;
        }
        else {
            offsetAngle = ((Math.PI * 2) - this.getOuterAngle() - parentPolygon.getOuterAngle()) / 2;
        }
        return offsetAngle;
    };
    Polygon.prototype.getOffsetDistance = function () {
        var offset = this.faceWidth;
        if (this.faces % 2 !== 0) {
            offset /= 2;
        }
        return offset;
    };
    Polygon.prototype.getSequenceGroupRadians = function (parentPolygon) {
        var ratio = this.getRatio(parentPolygon);
        var childFacesInGroup = ratio.n;
        var groupSize = ratio.d;
        var cornerRadians = parentPolygon.getExternalAngle() * groupSize;
        var faceRadians = this.getRadiansPerFace() * childFacesInGroup;
        return cornerRadians + faceRadians;
    };
    Polygon.prototype.getSequenceGroup = function (parentPolygon, totalAngle) {
        return math.floor(totalAngle / this.getSequenceGroupRadians(parentPolygon));
    };
    Polygon.prototype.getSequence = function (parentPolygon) {
        var ratio = this.getRatio(parentPolygon);
        var sequence = [];
        var maxValue = math.ceil(math.number(ratio));
        var offset = this.getOffsetDistance();
        var offsetDistance = offset;
        for (var parentIndex = 0; parentIndex < ratio.d; parentIndex++) {
            for (var childIndex = 0; childIndex <= maxValue; childIndex++) {
                var distance = offsetDistance + (childIndex * this.faceWidth);
                if (distance > ((parentIndex + 1) * parentPolygon.faceWidth)) {
                    sequence.push(childIndex);
                    var sequenceSum = sequence.reduce(function (sum, value) { return sum + value; }, 0);
                    offsetDistance = offset + (sequenceSum * this.faceWidth);
                    break;
                }
            }
        }
        return sequence;
    };
    Polygon.prototype.getCornersPassed = function (parentPolygon) {
        var cornersPassed = 0;
        var sequence = this.getSequence(parentPolygon);
        return cornersPassed;
    };
    Polygon.prototype.getRadiansInCurrentRoll = function (parentPolygon) {
        // Offsets
        var offsetRadians = this.getOffsetRadians(parentPolygon);
        var offsetDistance = this.getOffsetDistance();
        // Sequence details
        var sequence = this.getSequence(parentPolygon);
        var ratio = this.getRatio(parentPolygon);
        // Total angle relative to offset
        var totalAngle = Math.abs(this.state.totalAngle) - offsetRadians;
        // Process offset
        if (totalAngle < 0) {
            return offsetRadians + Math.abs(this.state.totalAngle);
        }
        // Find the active group
        var sequenceGroup = this.getSequenceGroup(parentPolygon, totalAngle);
        var offsetGroupRadians = sequenceGroup * this.getSequenceGroupRadians(parentPolygon);
        var radiansRelativeToGroup = totalAngle - (offsetGroupRadians);
        // Find the active parent face (relative to the group) in the sequence
        var parentActiveFace;
        var childFacesRolled = 0;
        for (parentActiveFace = 0; parentActiveFace < sequence.length; parentActiveFace++) {
            childFacesRolled += sequence[parentActiveFace];
            var radiansRolled = (childFacesRolled * this.getRadiansPerFace());
            var cornerRads_1 = parentPolygon.getExternalAngle() * (parentActiveFace + 1);
            if ((radiansRelativeToGroup - (radiansRolled + cornerRads_1)) < 0) {
                break;
            }
        }
        //Find the active child face (relative to the Paf) in the sequence
        var childRolls = sequence.slice(0, parentActiveFace);
        var childRollsSum = childRolls.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        var childRollsRads = childRollsSum * this.getRadiansPerFace();
        var cornerRads = parentPolygon.getExternalAngle() * parentActiveFace;
        var radiansRelativeToPaf = radiansRelativeToGroup - (childRollsRads + cornerRads);
        var childActiveFace;
        for (childActiveFace = 0; childActiveFace < sequence[parentActiveFace]; childActiveFace++) {
            if ((radiansRelativeToPaf - ((childActiveFace + 1) * this.getRadiansPerFace())) < 0) {
                break;
            }
        }
        // Detect when child is on parent corner
        var currentChildFace = (ratio.n * sequenceGroup) + childRollsSum + childActiveFace;
        var radiansInPaf = (sequence[parentActiveFace] * this.getRadiansPerFace());
        var distanceFromOrigin = this.getDistanceFromOriginToContact(parentPolygon);
        var onParentCorner = radiansInPaf <= radiansRelativeToPaf;
        var onChildCorner = ((distanceFromOrigin + offsetDistance) % this.faceWidth) === 0;
        // Calculate radians since last complete turn
        if (onParentCorner === true && onChildCorner === true) {
            return (radiansRelativeToPaf - radiansInPaf) + this.getRadiansPerFace();
        }
        else if (onParentCorner === true) {
            return (radiansRelativeToPaf - radiansInPaf);
        }
        return radiansRelativeToPaf % this.getRadiansPerFace();
    };
    Polygon.prototype.getDistanceFromOriginToContact = function (parentPolygon) {
        // Offsets
        var offsetRadians = this.getOffsetRadians(parentPolygon);
        var offsetDistance = this.getOffsetDistance();
        // Sequence details
        var sequence = this.getSequence(parentPolygon);
        var ratio = this.getRatio(parentPolygon);
        // Total angle relative to offset
        var totalAngle = Math.abs(this.state.totalAngle) - offsetRadians;
        this.onCorner = false;
        // Process offset
        if (totalAngle < 0) {
            this.onCorner = true;
            return 0;
        }
        // Find the active group
        var sequenceGroup = this.getSequenceGroup(parentPolygon, totalAngle);
        var offsetGroupRadians = sequenceGroup * this.getSequenceGroupRadians(parentPolygon);
        var radiansRelativeToGroup = totalAngle - (offsetGroupRadians);
        // Find the active parent face (relative to the group) in the sequence
        var parentActiveFace;
        var childFacesRolled = 0;
        for (parentActiveFace = 0; parentActiveFace < sequence.length; parentActiveFace++) {
            childFacesRolled += sequence[parentActiveFace];
            var radiansRolled = (childFacesRolled * this.getRadiansPerFace());
            var cornerRads_2 = parentPolygon.getExternalAngle() * (parentActiveFace + 1);
            if ((radiansRelativeToGroup - (radiansRolled + cornerRads_2)) < 0) {
                break;
            }
        }
        //Find the active child face (relative to the Paf) in the sequence
        var childRolls = sequence.slice(0, parentActiveFace);
        var childRollsSum = childRolls.reduce(function (sum, value) { return sum + value; }, 0);
        var childRollsRads = childRollsSum * this.getRadiansPerFace();
        var cornerRads = parentPolygon.getExternalAngle() * parentActiveFace;
        var radiansRelativeToPaf = radiansRelativeToGroup - (childRollsRads + cornerRads);
        var childActiveFace;
        for (childActiveFace = 0; childActiveFace < sequence[parentActiveFace]; childActiveFace++) {
            if ((radiansRelativeToPaf - ((childActiveFace + 1) * this.getRadiansPerFace())) < 0) {
                break;
            }
        }
        // Detect when child is on parent corner
        var currentChildFace = (ratio.n * sequenceGroup) + childRollsSum + childActiveFace;
        var radiansInPaf = (sequence[parentActiveFace] * this.getRadiansPerFace());
        var onCorner = radiansInPaf <= radiansRelativeToPaf;
        // Calculate distance from origin
        var distanceFromOrigin = (currentChildFace * this.faceWidth) + offsetDistance;
        if (onCorner === true) {
            distanceFromOrigin = ((ratio.d * sequenceGroup) + (parentActiveFace + 1)) * parentPolygon.faceWidth;
            this.onCorner = true;
        }
        var remainingRadians = radiansRelativeToPaf % this.getRadiansPerFace();
        /*
        // Get the distance from the start of the Paf
        const distanceFromPafStart: number = distanceFromOrigin % parentPolygon.faceWidth;
        const PafFromOriginDistance: number = Math.floor(distanceFromOrigin / parentPolygon.faceWidth);

        const fixedStyle = 'font-weight: bold; color: cyan; background: black; padding: 2px;';
        const stateStyle = 'font-weight: bold; color: orange; background: black; padding: 2px;';
        console.log('-----------------');
            console.log('----> %c' + currentChildFace + ' : ' + Math.round(totalAngle/this.getStepRadians()) + '%c <----',
                'font-weight: bold; color: red; background: black;',
                'font-weight: normal; color: inherit;'
            );
        console.groupCollapsed()
            console.log('C / P faces: %c' + this.faces + ' / ' + parentPolygon.faces, fixedStyle);
            console.log('steps per face: %c' + this.steps / this.faces, fixedStyle);
            console.log('sequence: %c' + sequence, fixedStyle);
            //console.log('radiansPerFace: %c' + this.getRadiansPerFace(), fixedStyle);
            //console.log('stepRadians: %c' + this.getStepRadians(), fixedStyle);
            //console.log('offset: %c' + offsetRadians, fixedStyle);
        console.groupEnd();
            //console.log('totalAngle:  %c' + totalAngle, stateStyle);
            console.log('sequenceGroup:  %c' + sequenceGroup, stateStyle);
            //console.log('radiansRelativeToGroup:  %c' + radiansRelativeToGroup, stateStyle);
            //console.log('offsetGroupRadians:  %c' + offsetGroupRadians, stateStyle);
            console.log('parentActiveFace:  %c' + parentActiveFace, stateStyle);
            console.log('PafFromOriginDistance:  %c' + PafFromOriginDistance, stateStyle);
            console.log('radiansInPaf: %c' + radiansInPaf, fixedStyle);
            console.log('radiansRelativeToPaf: %c' + radiansRelativeToPaf, fixedStyle);
        console.log('- - - - - - -');
            //console.log('childRolls:  %c' + childRolls, stateStyle);
            console.log('onCorner:  %c' + onCorner, stateStyle);
            //console.log('childRollsSum:  %c' + childRollsSum, stateStyle);
            //console.log('radiansRelativeToPaf:  %c' + radiansRelativeToPaf, stateStyle);
            console.log('childActiveFace:  %c' + childActiveFace, stateStyle);
            console.log('distanceFromOrigin:  %c' + distanceFromOrigin, stateStyle);
            console.log('distanceFromPafStart:  %c' + distanceFromPafStart, stateStyle);
        */
        return distanceFromOrigin;
    };
    Polygon.prototype.getParentDistanceFromOriginToContact = function (parentPolygon) {
        return 0;
    };
    Polygon.prototype.getDistanceFromParentCornerToContact = function (parentPolygon) {
        var cornersPassed = this.getCornersPassed(parentPolygon);
        return 0;
    };
    // Calculate values of a triangle where we know two sides and the angle between them
    Polygon.prototype.getValuesFromSAS = function (sideB, angleA, sideC) {
        var sideA; // a
        var angleB; // B
        var angleC; // C
        // a^2 = b^2 + c^2 − 2bc cosA
        sideA = Math.sqrt(Math.pow(sideB, 2) + Math.pow(sideC, 2) - (2 * sideB * sideC * Math.cos(angleA)));
        var smallAngle;
        if (sideA === 0) {
            smallAngle = Math.PI / 2;
        }
        else {
            smallAngle = Math.asin((Math.sin(angleA) * Math.min(sideB, sideC)) / sideA);
        }
        var largeAngle = Math.PI - smallAngle - angleA;
        if (sideB < sideC) {
            angleB = smallAngle;
            angleC = largeAngle;
        }
        else {
            angleC = smallAngle;
            angleB = largeAngle;
        }
        var polygonSas = new PolygonSas();
        polygonSas.a = sideA;
        polygonSas.b = sideB;
        polygonSas.c = sideC;
        polygonSas.A = angleA;
        polygonSas.B = angleB;
        polygonSas.C = angleC;
        return polygonSas;
    };
    Object.defineProperty(Polygon.prototype, "clockwise", {
        get: function () {
            return this.config.clockwise;
        },
        set: function (clockwise) {
            this.config.clockwise = clockwise;
            this.dispatchEvent(new events_1.AttributeChangedEvent('clockwise', this.clockwise));
        },
        enumerable: true,
        configurable: true
    });
    return Polygon;
}(structure_1.EventEmitter));
exports.Polygon = Polygon;
var PolygonState = /** @class */ (function () {
    function PolygonState() {
        this.centre = new PolygonCenterPosition();
        this.drawPoint = new PolygonDrawPosition();
        this.contactPoint = new PolygonContactPosition();
        this.initialState = Object.create(this);
        this.previousState = null;
        this.totalAngle = 0;
    }
    PolygonState.prototype.getAngle = function () {
        return Math.atan2((this.drawPoint.y - this.centre.y), // Delta Y
        (this.drawPoint.x - this.centre.x) // Delta X
        );
    };
    return PolygonState;
}());
exports.PolygonState = PolygonState;
var PolygonCenterPosition = /** @class */ (function () {
    function PolygonCenterPosition() {
        this.x = 0;
        this.y = 0;
    }
    return PolygonCenterPosition;
}());
exports.PolygonCenterPosition = PolygonCenterPosition;
var PolygonDrawPosition = /** @class */ (function () {
    function PolygonDrawPosition() {
    }
    return PolygonDrawPosition;
}());
exports.PolygonDrawPosition = PolygonDrawPosition;
var PolygonContactPosition = /** @class */ (function () {
    function PolygonContactPosition() {
    }
    return PolygonContactPosition;
}());
exports.PolygonContactPosition = PolygonContactPosition;
var PolygonSas = /** @class */ (function () {
    function PolygonSas() {
    }
    return PolygonSas;
}());
var PolygonConfigDefault = /** @class */ (function () {
    function PolygonConfigDefault() {
        var _newTarget = this.constructor;
        this.steps = 500;
        this.outside = true;
        this.fixed = true;
        this.clockwise = true;
        this.stepMod = 0;
        this.startAngle = 0;
        this.isRoot = false;
        if (_newTarget === circle_1.CircleConfigDefault) {
            Object.freeze(this);
        }
    }
    return PolygonConfigDefault;
}());
var PolygonConfig = /** @class */ (function (_super) {
    __extends(PolygonConfig, _super);
    function PolygonConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PolygonConfig;
}(PolygonConfigDefault));
exports.PolygonConfig = PolygonConfig;
