/**
 * A class for managing the number of cars in a container.
 */
class CarContainer {
    /**
     * The number of cars in the container.
     * @protected
     * @type {number}
     */
    protected numberOfCars = 0;

    /**
     * Adds a car to the container.
     */
    addCar() {
        this.numberOfCars++;
    }

    /**
     * Tries to remove a car from the container.
     * If there are no cars, nothing happens.
     */
    tryToRemoveCar() {
        if (this.numberOfCars > 0) {
            this.numberOfCars--;
        }
    }

    /**
     * Gets the number of cars in the container.
     *
     * @returns {number} - The number of cars in the container.
     */
    getNumberOfCars() {
        return this.numberOfCars;
    }
}

export { CarContainer };
