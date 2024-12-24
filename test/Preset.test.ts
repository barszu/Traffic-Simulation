import { AddVehicleCommandName, Command, Preset, StepCommandName } from "../src/Preset";
import { Directions } from "../src/Direction";

describe("Preset", () => {
    it("should create nodes and edges from a valid preset", () => {
        const preset = ["N1 -> S2", "E3 -> W4"];
        const { nodes, edges } = Preset.createPreset(preset, new Map());

        expect(nodes.size).toBe(4);
        expect(edges.size).toBe(2);

        const nodeArray = Array.from(nodes);
        expect(nodeArray).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ position: Directions.North, id: 1 }),
                expect.objectContaining({ position: Directions.South, id: 2 }),
                expect.objectContaining({ position: Directions.East, id: 3 }),
                expect.objectContaining({ position: Directions.West, id: 4 }),
            ])
        );

        const edgeArray = Array.from(edges);
        expect(edgeArray).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    startNode: expect.objectContaining({ position: Directions.North, id: 1 }),
                    destinationNode: expect.objectContaining({ position: Directions.South, id: 2 }),
                }),
                expect.objectContaining({
                    startNode: expect.objectContaining({ position: Directions.East, id: 3 }),
                    destinationNode: expect.objectContaining({ position: Directions.West, id: 4 }),
                }),
            ])
        );
    });

    it("should skip invalid lines and log warnings", () => {
        const preset = ["N1 -> S2", "InvalidLine", "E3 -> W4"];
        console.warn = jest.fn();

        const { nodes, edges } = Preset.createPreset(preset, new Map());

        expect(nodes.size).toBe(4);
        expect(edges.size).toBe(2);
        expect(console.warn).toHaveBeenCalledWith("Invalid line", "InvalidLine", "skipping...");
    });

    it("should skip reversing lines and log warnings", () => {
        const preset = ["N1 -> N1", "E3 -> W4"];
        console.warn = jest.fn();

        const { nodes, edges } = Preset.createPreset(preset, new Map());

        expect(nodes.size).toBe(2);
        expect(edges.size).toBe(1);
        expect(console.warn).toHaveBeenCalledWith("Reversing line", "N1 -> N1", "skipping...");
    });
});

describe("Preset private static methods", () => {
    let MockedPreset: Preset | any;

    beforeEach(() => {
        MockedPreset = Preset as any;

        const commandsChecker = (Preset as any)["commandsChecker"];
        const singleConnectionChecker = (Preset as any)["singleConnectionChecker"];
        const connectionsChecker = (Preset as any)["connectionsChecker"];

        MockedPreset.commandsChecker = commandsChecker;
        MockedPreset.singleConnectionChecker = singleConnectionChecker;
        MockedPreset.connectionsChecker = connectionsChecker;
    });

    it("should validate commands correctly!!!!", () => {
        const validCommands: Command[] = [
            { type: AddVehicleCommandName, startRoad: "N1", endRoad: "S2" },
            { type: StepCommandName },
        ];

        expect(() => MockedPreset.commandsChecker(validCommands)).not.toThrow();

        const invalidCommands = [{ type: "invalidType" }, { type: AddVehicleCommandName, startRoad: "N1" }];

        expect(() => MockedPreset.commandsChecker(invalidCommands)).toThrow();
    });

    it("should validate connections correctly", () => {
        const validConnections = ["N1 -> S2", "E3 -> W4"];

        expect(() => MockedPreset.connectionsChecker(validConnections)).not.toThrow();

        const invalidConnections = ["N1 - S2", "InvalidConnection"];

        expect(() => MockedPreset.connectionsChecker(invalidConnections)).toThrow();
    });

    it("should validate collisions correctly", () => {
        const validCollisions = {
            "N1 -> S2": ["E3 -> W4"],
            "E3 -> W4": ["N1 -> S2"],
        };

        expect(() => MockedPreset.collisionsChecker(validCollisions)).not.toThrow();

        const invalidCollisions = {
            "N1 -> S2": "E3 -> W4",
            "E3 -> W4": ["InvalidConnection"],
        };

        expect(() => MockedPreset.collisionsChecker(invalidCollisions)).toThrow();
    });
});
