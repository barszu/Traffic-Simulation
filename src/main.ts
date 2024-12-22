import { BasicSimulation } from "./simulations/BasicSimulation";
import { loadPreset } from "./preset";


// rob kruskala z kolorowaniem do wydzielenia najwiekszych grup dla swiatel, ktore nie koliduja

// krawedzie sie przetna jesli maja wspolne wezly, zrodla z innych kierunkow gdzie kreska sie przetnie
// np. jesli w N->S1, E->S2 gdzie droga wyglada tak S1 | S2  (na odwrot bylo by git)
// ale tez zalezy od budowy drogi



function main() {
    const {nodes, edges, commands} = loadPreset()

    const manager = new BasicSimulation(nodes, edges)

    let stepNumber = 0

    manager.addOnLightsChangeCallback(() => {
        console.log("Lights changed")
        console.log(manager.getStatus())
        stepNumber++
    })

    // zrob z tego command executor

    for (const command of commands) {
        if (command.type === "addVehicle") {
            manager.addCar(command.startRoad) //samochody powinny miec krawedzie
        } else if (command.type === "step") {
            const oldStepNumber = stepNumber
            while (oldStepNumber === stepNumber) { // step until lights change, maksymalnie ilosc ruchu oczekiwania na zmiane swiatel bo ten case nie wygodny
                // manager.nextGroupUsingTrafic()
                manager.nextGroup()
            }
        }
    }
}

main()

