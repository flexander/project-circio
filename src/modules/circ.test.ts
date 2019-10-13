import { Circ } from './Circ';

describe('Circ', () => {
    let testCirc;
    beforeEach(() => {
        testCirc = new Circ();
    });

    it('should create a valid circ', () => {
        expect(testCirc).not.toBe(null);
    });
});
