import { Edge } from "./Edge";
import { RoadNode } from "./RoadNode";


const mockedPreset = ["S2 -> N1", "N2 -> S1", "S2 -> W1"];
const mockedCommands: Command[] = [
    {
        type: "addVehicle",
        startRoad: "S2",
        endRoad: "W1"
    },
    {
        type: "addVehicle",
        startRoad: "N2",
        endRoad: "S1"
    },
    {
        type: "step"
    },
    {
        type: "step"
    },
    {
        type: "addVehicle",
        startRoad: "S2",
        endRoad: "N1"
    },
    {
        type: "addVehicle",
        startRoad: "S2",
        endRoad: "N1"
    },
    {
        type: "step"
    },
    {
        type: "step"
    }
];

function createPreset(preset : Array<string>) : [Set<RoadNode> , Set<Edge>] {
    const allNodes = new Set<RoadNode>()
    const edges = new Set<Edge>()

    for (const road of preset) {
        try {
            const edge = Edge.createFrom(road)

            // zawracanie jest brane jako skret w lewo wiec pomijamy
            // zakładam ze jesli jest zawracanie dla tego pasa to i jest skręt w lewo
            if (edge.startNode.position === edge.destinationNode.position) {
                console.warn("Reversing line", road, "skipping...")
                continue
            }

            edges.add(edge)
            allNodes.add(edge.startNode)
            allNodes.add(edge.destinationNode)
        } catch (error) {
            console.warn("Invalid line", road, "skipping...")
            console.warn("Error", error)
        }
        
    }
    return [allNodes, edges]
}

type Command = AddVehicleCommand | StepCommand;

type AddVehicleCommand = {
    type: "addVehicle";
    startRoad: string;
    endRoad: string;
};

type StepCommand = {
    type: "step";
};

function loadPreset() { //TODO
    const preset = mockedPreset
    const commands = mockedCommands

    const [nodes, edges] = createPreset(preset)
    return {nodes, edges, commands}
}

export { loadPreset, createPreset }
