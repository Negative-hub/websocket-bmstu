class Cars {
  constructor() {
    this.cars = []
  }

  add(car) {
    this.cars.push(car)
  }

  get(id) {
    return this.cars.find(car => car.car === id)
  }

  remove(id) {
    const car = this.get(id)

    if (car) {
      this.cars = this.cars.filter(car => car.id !== id)
    }

    return car
  }
}

module.exports = function() {
  return new Cars()
}
