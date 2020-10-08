import { Circle } from './circle';

describe('Circle', () => {
    describe('constructor', () => {
        it('should create a valid circle', () => {
            const circle = new Circle();
            expect(circle).not.toBe(null);
        });
    });

    describe('get/set radius', () => {
        let circle;
        let radius = 10;

        beforeEach(() => {
            circle = new Circle();
        });

        describe('set radius', () => {
            it('should set the radius', () => {
                circle.radius = radius;
                expect(circle.config.radius).toEqual(radius);
            });

            it('should not allow the radius to be zero', () => {
                expect(_ => {circle.radius = 0}).toThrow();
            });

            it('should not allow the radius to be non-numeric', () => {
                expect(_ => {circle.radius = 'radius'}).toThrow();
            });
        });

        describe('get radius', () => {
            it('should get the name', () => {
                circle.config.radius = radius;
                expect(circle.radius).toEqual(radius);
            });
        });
    });
});
