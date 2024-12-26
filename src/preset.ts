import { Edge } from "./Edge";
import { RoadNode } from "./RoadNode";
import * as fs from "fs";
import * as path from "path";
import { MatrixGraph } from "./graph/MatrixGraph";

const AddVehicleCommandName = "addVehicle";
const StepCommandName = "step";

type Command = AddVehicleCommand | StepCommand;

interface AddVehicleCommand {
    type: typeof AddVehicleCommandName;
    startRoad: string;
    endRoad: string;
}

interface StepCommand {
    type: typeof StepCommandName;
}

/**
 * A class for managing and creating presets.
 */
class Preset {
    presetFilePath: string;

    /**
     * Creates an instance of Preset.
     * @param {string} presetFilePath - The file path to the preset file.
     */
    constructor(presetFilePath: string) {
        this.presetFilePath = presetFilePath;
    }

    /**
     * Creates a preset from the given connections and collisions.
     * @param {Array<string>} preset - An array of road connections.
     * @param {Map<string, Array<string>>} collisions - A map of collisions.
     * @returns {{nodes: Set<RoadNode>, edges: Set<Edge>, edgeCollisions: MatrixGraph<Edge>}} - The created preset.
     */
    static createPreset(
        preset: Array<string>,
        collisions: Map<string, Array<string>>
    ): {
        nodes: Set<RoadNode>;
        edges: Set<Edge>;
        edgeCollisions: MatrixGraph<Edge>;
    } {
        const allNodes = new Set<RoadNode>();
        const edges = new Set<Edge>();

        for (const road of preset) {
            try {
                const edge = Edge.createFrom(road);

                // zawracanie jest brane jako skret w lewo wiec pomijamy
                // zakładam ze jesli jest zawracanie dla tego pasa to i jest skręt w lewo
                if (edge.startNode.position === edge.destinationNode.position) {
                    console.warn("Reversing line", road, "skipping...");
                    continue;
                }

                edges.add(edge);
                allNodes.add(edge.startNode);
                allNodes.add(edge.destinationNode);
            } catch (error) {
                console.warn("Invalid line", road, "skipping...");
                console.warn("Error", error);
            }
        }

        const edgeCollisionsMatrix = new MatrixGraph(Array.from(edges));
        const collisionsMap: Map<string, string[]> = new Map(Object.entries(collisions));

        for (const [key, value] of collisionsMap) {
            const primaryEdge = Edge.createFrom(key);
            const collidingEdges = value.map(edge => Edge.createFrom(edge));

            collidingEdges.forEach(edge => {
                edgeCollisionsMatrix.addEdge(primaryEdge, edge);
            });
        }

        return { nodes: allNodes, edges, edgeCollisions: edgeCollisionsMatrix };
    }

    /**
     * Loads the preset from the file.
     * @returns {{nodes: Set<RoadNode>, edges: Set<Edge>, commands: Array<Command>, edgeCollisions: MatrixGraph<Edge>}} - The loaded preset.
     */
    loadPreset() {
        const { commands, connections, collisions } = this.loadJsonPreset();

        const { nodes, edges, edgeCollisions } = Preset.createPreset(connections, collisions);
        return { nodes, edges, commands, edgeCollisions };
    }

    /**
     * Loads the JSON preset from the file.
     * @private
     * @returns {{commands: Array<Command>, connections: Array<string>, collisions: Map<string, Array<string>>}} - The loaded JSON preset.
     */
    private loadJsonPreset(): {
        commands: Array<Command>;
        connections: Array<string>;
        collisions: Map<string, Array<string>>;
    } {
        const filePath = path.resolve(__dirname, this.presetFilePath);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        try {
            const preset = JSON.parse(fileContent);

            const commands = Preset.commandsChecker(preset.commands);
            const connections = Preset.connectionsChecker(preset.connections);
            const collisions = Preset.collisionsChecker(preset.collisions);

            return { commands, connections, collisions };
        } catch (error) {
            console.error("Error while parsing preset file", error);
            throw error;
        }
    }

    /**
     * Checks the validity of the commands.
     * @private
     * @param {any} commands - The commands to check.
     * @returns {Array<Command>} - The validated commands.
     * @throws {Error} - If the commands are invalid.
     */
    private static commandsChecker(commands: any): Array<Command> {
        if (!Array.isArray(commands)) {
            throw new Error("Commands should be an array");
        }

        commands.forEach((command: any, index: number) => {
            if (typeof command.type !== "string") {
                throw new Error(`Invalid command at index ${index}: missing or invalid type`);
            }
            if (command.type === AddVehicleCommandName) {
                if (typeof command.startRoad !== "string" || typeof command.endRoad !== "string") {
                    throw new Error(
                        `Invalid addVehicle command at index ${index}: missing or invalid startRoad or endRoad`
                    );
                }
            } else if (command.type !== StepCommandName) {
                throw new Error(`Invalid command type at index ${index}: ${command.type}`);
            }
        });

        return commands;
    }

    /**
     * Checks the validity of a single connection.
     * @private
     * @param {string} connection - The connection to check.
     * @returns {string} - The validated connection.
     * @throws {Error} - If the connection is invalid.
     */
    private static singleConnectionChecker(connection: string): string {
        if (typeof connection !== "string" || !connection.includes(" -> ")) {
            throw new Error(`Invalid connection: ${connection}`);
        }
        return connection;
    }

    /**
     * Checks the validity of the connections.
     * @private
     * @param {any} connections - The connections to check.
     * @returns {Array<string>} - The validated connections.
     * @throws {Error} - If the connections are invalid.
     */
    private static connectionsChecker(connections: any): Array<string> {
        if (!Array.isArray(connections)) {
            throw new Error("Connections should be an array");
        }

        connections.forEach((connection: any, index: number) => {
            this.singleConnectionChecker(connection);
        });

        return connections;
    }

    /**
     * Checks the validity of the collisions.
     * @private
     * @param {any} collisionsMap - The collisions to check.
     * @returns {Map<string, Array<string>>} - The validated collisions.
     * @throws {Error} - If the collisions are invalid.
     */
    private static collisionsChecker(collisionsMap: any): Map<string, Array<string>> {
        if (typeof collisionsMap !== "object") {
            throw new Error("Collisions should be an object");
        }

        for (const [key, value] of Object.entries(collisionsMap)) {
            if (!Array.isArray(value)) {
                throw new Error(`Invalid value for key ${key}: ${value}`);
            }
            value.forEach((connection: any, index: number) => {
                this.singleConnectionChecker(connection);
            });
            this.singleConnectionChecker(key);
        }

        return collisionsMap;
    }
}

export { Preset, StepCommandName, AddVehicleCommandName, Command, AddVehicleCommand, StepCommand };
