import { Preset, AddVehicleCommandName, StepCommandName } from "./Preset";
import { AdvancedSimulation } from "./simulations/AdvancedSimulation";

function main() {
    const presetFilePath = "../presets/preset1.json";

    const { nodes, edges, commands, edgeCollisions } = new Preset(presetFilePath).loadPreset();

    // const manager: AbstractSimulation = new BasicSimulation(nodes, edges, edgeCollisions);
    const manager = new AdvancedSimulation(nodes, edges, edgeCollisions);

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
