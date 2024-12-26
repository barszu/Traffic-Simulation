import { RoadNode } from "./RoadNode";
import { CarContainer } from "./util/CarContainer";

/**
 * A class representing a road connection (edge) between two road nodes.
 * Extends the CarContainer class to manage the number of cars on the edge.
 * Does not contain as many cars as a lane.
 * Singleton, all Edges with same start and end node are the same (by instance).
 */
class Edge extends CarContainer {
    private static instances: Map<string, Edge> = new Map();

    /**
     * The starting node of the edge.
     * @readonly
     * @type {RoadNode}
     */
    readonly startNode: RoadNode;

    /**
     * The destination node of the edge.
     * @readonly
     * @type {RoadNode}
     */
    readonly destinationNode: RoadNode;

    /**
     * Creates an instance of Edge.
     * @private
     * @param {RoadNode} from - The starting node.
     * @param {RoadNode} to - The destination node.
     */
    private constructor(from: RoadNode, to: RoadNode) {
        super();
        this.startNode = from;
        this.destinationNode = to;

        from.connect(to);
    }

    /**
     * Returns a string representation of the edge.
     * @returns {string} - The string representation of the edge.
     */
    public toString(): string {
        return `${this.startNode} -> ${this.destinationNode}`;
    }

    /**
     * Creates an edge from a string representation.
     * @param {string} text - The string representation of the edge (e.g., "N1 -> S2").
     * @returns {Edge} - The created edge.
     * @throws {Error} - If the string representation is invalid.
     */
    public static createFrom(text: string): Edge {
        try {
            const [from, to] = text.split(" -> ");
            const fromNode = RoadNode.createFrom(from);
            const toNode = RoadNode.createFrom(to);

            return Edge.getInstance(fromNode, toNode);
        } catch (error) {
            throw new Error(`Invalid Edge: ${text}`);
        }
    }

    /**
     * Gets an instance of Edge between two nodes.
     * If an edge already exists between the nodes, returns the existing instance.
     * @param {RoadNode} from - The starting node.
     * @param {RoadNode} to - The destination node.
     * @returns {Edge} - The edge instance.
     */
    public static getInstance(from: RoadNode, to: RoadNode): Edge {
        const key = `${from.toString()} -> ${to.toString()}`;
        if (!Edge.instances.has(key)) {
            Edge.instances.set(key, new Edge(from, to));
        }
        return Edge.instances.get(key)!;
    }

    /**
     * Creates a reversed edge.
     * @param {Edge} edge - The edge to reverse.
     * @returns {Edge} - The reversed edge.
     */
    public static reversed(edge: Edge): Edge {
        return Edge.getInstance(edge.destinationNode, edge.startNode);
    }
}

export { Edge };
