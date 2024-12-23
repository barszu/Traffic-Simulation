import { BasicSimulation } from "./simulations/BasicSimulation";
import { Preset, AddVehicleCommandName, StepCommandName } from "./preset";
import { AbstractSimulation } from "./simulations/AbstractSimulation";
import { AdvancedSimulation } from "./simulations/AdvancedSimulation";

// rob kruskala z kolorowaniem do wydzielenia najwiekszych grup dla swiatel, ktore nie koliduja

// krawedzie sie przetna jesli maja wspolne wezly, zrodla z innych kierunkow gdzie kreska sie przetnie
// np. jesli w N->S1, E->S2 gdzie droga wyglada tak S1 | S2  (na odwrot bylo by git)
// ale tez zalezy od budowy drogi

function main() {
    const presetFilePath = "../presets/preset1.json";

    const { nodes, edges, commands, edgeCollisions } = new Preset(presetFilePath).loadPreset();

    const manager: AbstractSimulation = new BasicSimulation(nodes, edges, edgeCollisions);
    // const manager = new AdvancedSimulation(nodes, edges, edgeCollisions);

    let stepNumber = 0;

    manager.addOnLightsChangeCallback(() => {
        console.log("Lights changed");
        console.log(manager.getStatusAsString());
        stepNumber++;
    });

    manager.addOnCarAddedCallback(() => {
        console.log("Car added to: ", manager.getWhereLastCarAdded());
        console.log(manager.getNumberOfCarsInGroupsAsString());
    });

    manager.addOnLightStayCallback(() => {
        console.log("Light stay");
    });

    console.log("Initial state");
    console.log(manager.getStatusAsString());
    for (const command of commands) {
        switch (command.type) {
            case AddVehicleCommandName:
                manager.addCar(command.startRoad); //samochody powinny miec krawedzie? w presetach
                break;
            case StepCommandName:
                const loopDetected = manager.nextStep();
                if (loopDetected) {
                    console.warn("Loop detected, ending simulation");
                    console.log("stepnumber", stepNumber);
                    break;
                }
                break;
        }
    }
}

main();
