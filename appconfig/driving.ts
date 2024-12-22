interface Config {
    lightFazeTime: number,
    maxFazesNoForSignal: number,
    maxFazesToWait: number
}

interface ConfigExtended extends Config {
    carStartDelay: {
        min: number,
        max: number
    },
    carGoThroughTime: number
}

const config : ConfigExtended = {
    lightFazeTime: 30, // seconds
    carStartDelay : {
        min: 0.5, // seconds
        max: 3 // seconds
    },
    carGoThroughTime: 5, // seconds
    maxFazesNoForSignal : 6, // trafic lights number of fazes
    maxFazesToWait: 5 // trafic lights number of fazes
}

function calculateCarsGoThroughNumber() {
    let remainingTime = config.lightFazeTime
    let cars = 0
    while(remainingTime > 0){
        const delay = Math.random() * (config.carStartDelay.max - config.carStartDelay.min) + config.carStartDelay.min
        remainingTime -= config.carGoThroughTime + delay
        cars++ ? remainingTime > 0 : null
    }
    return cars
}

export { config, calculateCarsGoThroughNumber }