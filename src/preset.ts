import { connect } from "http2";
import { Edge } from "./Edge";
import { RoadNode } from "./RoadNode";
import * as fs from "fs";
import * as path from "path";

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

class Preset {
    presetFilePath: string;

    constructor(presetFilePath: string) {
        this.presetFilePath = presetFilePath;
    }

    static createPreset(preset: Array<string>): [Set<RoadNode>, Set<Edge>] {
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
        return [allNodes, edges];
    }

    loadPreset() {
        const { commands, connections } = this.loadJsonPreset();

        const [nodes, edges] = Preset.createPreset(connections);
        return { nodes, edges, commands };
    }

    private loadJsonPreset(): {
        commands: Array<Command>;
        connections: Array<string>;
    } {
        const filePath = path.resolve(__dirname, this.presetFilePath);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        try {
            const preset = JSON.parse(fileContent);

            const commands = Preset.commandsChecker(preset.commands);
            const connections = Preset.connectionsChecker(preset.connections);

            return { commands, connections };
        } catch (error) {
            console.error("Error while parsing preset file", error);
            throw error;
        }
    }

    private static commandsChecker(commands: any): Array<Command> {
        if (!Array.isArray(commands)) {
            throw new Error("Commands should be an array");
        }

        commands.forEach((command: any, index: number) => {
            if (typeof command.type !== "string") {
                throw new Error(
                    `Invalid command at index ${index}: missing or invalid type`
                );
            }
            if (command.type === AddVehicleCommandName) {
                if (
                    typeof command.startRoad !== "string" ||
                    typeof command.endRoad !== "string"
                ) {
                    throw new Error(
                        `Invalid addVehicle command at index ${index}: missing or invalid startRoad or endRoad`
                    );
                }
            } else if (command.type !== StepCommandName) {
                throw new Error(
                    `Invalid command type at index ${index}: ${command.type}`
                );
            }
        });

        return commands;
    }

    private static connectionsChecker(connections: any): Array<string> {
        if (!Array.isArray(connections)) {
            throw new Error("Connections should be an array");
        }

        connections.forEach((connection: any, index: number) => {
            if (
                typeof connection !== "string" ||
                !connection.includes(" -> ")
            ) {
                throw new Error(
                    `Invalid connection at index ${index}: ${connection}`
                );
            }
        });

        return connections;
    }
}

export {
    Preset,
    StepCommandName,
    AddVehicleCommandName,
    Command,
    AddVehicleCommand,
    StepCommand,
};
