import { CarContainer } from '../src/util/CarContainer';

describe('CarContainer', () => {
    let container: CarContainer;

    beforeEach(() => {
        container = new CarContainer();
    });

    it('should initialize with zero cars', () => {
        expect(container.getNumberOfCars()).toBe(0);
    });

    it('should add a car', () => {
        container.addCar();
        expect(container.getNumberOfCars()).toBe(1);
    });

    it('should remove a car if there are cars', () => {
        container.addCar();
        container.tryToRemoveCar();
        expect(container.getNumberOfCars()).toBe(0);
    });

    it('should not remove a car if there are no cars', () => {
        container.tryToRemoveCar();
        expect(container.getNumberOfCars()).toBe(0);
    });
});