import { Circ } from './Circ';
import { Circle } from './Circle';
import { ShapeAddEvent, ShapeDeleteEvent, AttributeChangedEvent } from './events';

describe('Circ', () => {
    describe('constructor', () => {
        it('should create a valid circ', () => {
            const circ = new Circ();
            expect(circ).not.toBe(null);
        });
    });

    describe('addShape', () => {
        let circ;
        let shape1;
        beforeEach(() => {
            circ = new Circ();
            circ.dispatchEvent = jest.fn();
            shape1 = new Circle();
        });

        beforeEach(() => {
            circ.addShape(shape1);
        });

        it('should set the isRoot property of the first shape to true', () => {
            expect(shape1.isRoot).toEqual(true);
        });

        it('should set the isRoot property of the second shape to false', () => {
            const shape2 = new Circle();
            circ.addShape(shape2);
            expect(shape2.isRoot).toEqual(false);
        });

        it('should add the shape to the shapes array', () => {
            const expectedShapes = [shape1];
            expect(circ.getShapes()).toEqual(expectedShapes);
        });

        it('should call the dispatchEvent exactly once with the shape', () => {
            expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
            expect(circ.dispatchEvent).toHaveBeenCalledWith(new ShapeAddEvent(shape1));
        });
    });

    describe('removeShape', () => {
        let circ;
        let shape1;
        beforeEach(() => {
            circ = new Circ();
            circ.dispatchEvent = jest.fn();
            shape1 = new Circle();
        });

        it('should not call the dispatchEvent', () => {
            circ.shapes.push(shape1);
            circ.removeShape(shape1.id);
            expect(circ.dispatchEvent).not.toHaveBeenCalled();
        });

        it('should call the dispatchEvent exactly once with the shape', () => {
            circ.shapes.push(shape1);
            circ.removeShape(shape1.id+1);
            expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
            expect(circ.dispatchEvent).toHaveBeenCalledWith(new ShapeDeleteEvent(shape1));
        });

        it('should call the dispatchEvent twice with the shapes', () => {
            const shape2 = new Circle();
            circ.shapes.push(...[shape1, shape2]);
            circ.removeShape(shape1.id+1);
            expect(circ.dispatchEvent).toHaveBeenCalledTimes(2);
            expect(circ.dispatchEvent).toHaveBeenCalledWith(new ShapeDeleteEvent(shape1));
            expect(circ.dispatchEvent).toHaveBeenCalledWith(new ShapeDeleteEvent(shape2));
        });
    });

    describe('getShapes', () => {
        let circ;
        let shape1;
        beforeEach(() => {
            circ = new Circ();
            shape1 = new Circle();
        });

        it('should return the shapes', () => {
            circ.shapes.push(shape1);
            expect(circ.getShapes()).toEqual([shape1]);
        });
    });

    describe('get/set name', () => {
        let circ;
        const name = 'testName';

        beforeEach(() => {
            circ = new Circ();
            circ.dispatchEvent = jest.fn();
        });

        describe('set name', () => {
            it('should set the name', () => {
                circ.name = name;
                expect(circ.config.name).toEqual(name);
            });

            it('should call the dispatchEvent exactly once with the correct AttributeChangedEvent', () => {
                circ.name = name;
                expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
                expect(circ.dispatchEvent).toHaveBeenCalledWith(new AttributeChangedEvent('name', name));
            });
        });

        describe('get name', () => {
            it('should get the name', () => {
                circ.config.name = name;
                expect(circ.name).toEqual(name);
            });
        });
    });
});
