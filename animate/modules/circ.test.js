"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Circ_1 = require("./Circ");
describe('Circ', function () {
    var testCirc;
    beforeEach(function () {
        testCirc = new Circ_1.Circ();
    });
    it('should create a valid circ', function () {
        console.log('adf');
        expect(testCirc).not.toBe(null);
    });
});
