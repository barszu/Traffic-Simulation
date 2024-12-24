import { AbstractSimulation, isLoopDetected } from "../src/simulations/AbstractSimulation";
import { RoadNode } from "../src/RoadNode";
import { Edge } from "../src/Edge";
import { Directions } from "../src/Direction";
import { DescribedGroupType, SimulationStatus, SimulationStatusAsStrings } from "../src/simulations/AbstractSimulation";
import { Preset } from "../src/Preset";

describe("AbstractSimulation", () => {
    let simulation: AbstractSimulation;
    let nodes: Set<RoadNode>;
    let edges: Set<Edge>;
    let preGivenCollisions: any;

    beforeEach(() => {
        const connections = ["N1 -> S2"];
        const collisions = new Map();

        const preset = Preset.createPreset(connections, collisions);
        nodes = preset.nodes;
        edges = preset.edges;
        preGivenCollisions = preset.edgeCollisions;

        class MockedSimulation extends AbstractSimulation {
            protected nextGroup(): void {
                throw new Error("Method not implemented.");
            }
            nextStep(): boolean {
                throw new Error("Method not implemented.");
            }
        }

        simulation = new MockedSimulation(nodes, edges, preGivenCollisions);
    });

    it("should return the active group", () => {
        const activeGroup = simulation.getActiveGroup();
        expect(activeGroup.edges).toEqual(edges);
    });

    it("should return the simulation status", () => {
        const status: SimulationStatus = simulation.getStatus();
        expect(status.recentActiveGroup.edges).toEqual(edges);
        expect(status.recentActiveFazeTime).toBe(0);
        expect(status.waitingTimeForGroup.get(status.recentActiveGroup)).toBe(0);
    });
});
