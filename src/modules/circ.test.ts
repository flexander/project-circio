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

    describe('get/set height', () => {
        let circ;
        const height = 9000;

        beforeEach(() => {
            circ = new Circ();
            circ.dispatchEvent = jest.fn();
        });

        describe('set height', () => {
            it('should set the height', () => {
                circ.height = height;
                expect(circ.config.height).toEqual(height);
            });

            it('should call the dispatchEvent exactly once with the correct AttributeChangedEvent', () => {
                circ.height = height;
                expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
                expect(circ.dispatchEvent).toHaveBeenCalledWith(new AttributeChangedEvent('height', height));
            });
        });

        describe('get height', () => {
            it('should get the height', () => {
                circ.config.height = height;
                expect(circ.height).toEqual(height);
            });
        });
    });

    describe('get/set width', () => {
        let circ;
        const width = 123;

        beforeEach(() => {
            circ = new Circ();
            circ.dispatchEvent = jest.fn();
        });

        describe('set width', () => {
            it('should set the width', () => {
                circ.width = width;
                expect(circ.config.width).toEqual(width);
            });

            it('should call the dispatchEvent exactly once with the correct AttributeChangedEvent', () => {
                circ.width = width;
                expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
                expect(circ.dispatchEvent).toHaveBeenCalledWith(new AttributeChangedEvent('width', width));
            });
        });

        describe('get width', () => {
            it('should get the width', () => {
                circ.config.width = width;
                expect(circ.width).toEqual(width);
            });
        });
    });

    describe('get/set backgroundFill', () => {
        let circ;
        const backgroundFill = '#black';

        beforeEach(() => {
            circ = new Circ();
            circ.dispatchEvent = jest.fn();
        });

        describe('set backgroundFill', () => {
            it('should set the backgroundFill', () => {
                circ.backgroundFill = backgroundFill;
                expect(circ.config.backgroundFill).toEqual(backgroundFill);
            });

            it('should call the dispatchEvent exactly once with the correct AttributeChangedEvent', () => {
                circ.backgroundFill = backgroundFill;
                expect(circ.dispatchEvent).toHaveBeenCalledTimes(1);
                expect(circ.dispatchEvent).toHaveBeenCalledWith(new AttributeChangedEvent('backgroundFill', backgroundFill));
            });
        });

        describe('get backgroundFill', () => {
            it('should get the backgroundFill', () => {
                circ.config.backgroundFill = backgroundFill;
                expect(circ.backgroundFill).toEqual(backgroundFill);
            });
        });
    });

    describe('get modified', () => {
        let circ;
        const modified = true;

        beforeEach(() => {
            circ = new Circ();
            circ.dispatchEvent = jest.fn();
        });

        it('should get the modified value', () => {
            circ.config.modified = modified;
            expect(circ.modified).toEqual(modified);
        });
    });
});
