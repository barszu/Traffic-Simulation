class CarContainer {

  protected numberOfCars = 0;

  addCar() {
    this.numberOfCars++;
  }

  tryToRemoveCar() {
    this.numberOfCars > 0 ? this.numberOfCars-- : null;
  }

  getNumberOfCars() {
    return this.numberOfCars;
  }
}

export { CarContainer };