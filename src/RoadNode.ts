import { Directions, parseDirection } from "./Direction";
import { CarContainer } from "./util/CarContainer";

/**
 * A class representing a road node (lane).
 * Singleton for name and direction.
 */
class RoadNode extends CarContainer {
    private static instances: Map<string, RoadNode> = new Map();

    /**
     * The ID of the road node.
     * @readonly
     * @type {number}
     */
    readonly id: number;

    /**
     * The position (direction) of the road node.
     * @readonly
     * @type {Directions}
     */
    readonly position: Directions;

    /**
     * The set of connected road nodes.
     * @readonly
     * @type {Set<RoadNode>}
     */
    readonly connections: Set<RoadNode> = new Set();

    /**
     * Creates an instance of RoadNode.
     * @private
     * @param {Directions} position - The position (direction) of the road node.
     * @param {number} id - The ID of the road node.
     */
    private constructor(position: Directions, id: number) {
        super();
        this.id = id;
        this.position = position;
    }

    /**
     * Returns a string representation of the road node.
     * @returns {string} - The string representation of the road node.
     */
    toString(): string {
        return `${this.position}${this.id}`;
    }

    /**
     * Creates a road node from a string representation.
     * @param {string} text - The string representation of the road node (e.g., "N1").
     * @returns {RoadNode} - The created road node.
     * @throws {Error} - If the string representation is invalid.
     */
    static createFrom(text: string): RoadNode {
        try {
            let position = text[0];
            let id = text.slice(1);

            const positionParsed = parseDirection(position);
            const idParsed = parseInt(id);

            if (isNaN(idParsed)) {
                throw new Error(`Invalid RoadNode: ${text}`);
            }

            return RoadNode.getInstance(positionParsed, idParsed);
        } catch (error) {
            throw new Error(`Invalid RoadNode: ${text}`);
        }
    }

    /**
     * Gets an instance of RoadNode with the given position and ID.
     * If a road node already exists with the given position and ID, returns the existing instance.
     * @param {Directions} position - The position (direction) of the road node.
     * @param {number} id - The ID of the road node.
     * @returns {RoadNode} - The road node instance.
     */
    static getInstance(position: Directions, id: number): RoadNode {
        const key = `${position}${id}`;
        if (!RoadNode.instances.has(key)) {
            RoadNode.instances.set(key, new RoadNode(position, id));
        }
        return RoadNode.instances.get(key)!;
    }

    /**
     * Connects this road node to another road node.
     * @param {RoadNode} node - The road node to connect to.
     */
    connect(node: RoadNode) {
        this.connections.add(node);
    }
}

export { RoadNode };
