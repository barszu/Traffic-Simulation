import { Directions, parseDirection } from "./Direction";
import { CarContainer } from "./util/CarContainer";

class RoadNode extends CarContainer { //aka pas drogowy
    readonly id: number;
    readonly position: Directions;
    readonly connections: Set<RoadNode> = new Set();

    constructor(position: Directions, id: number) {
        super();
        this.id = id;
        this.position = position;
    }

    toString(): string {
        return `${this.position}${this.id}`;
    }

    static createFrom(text: string): RoadNode {
        try {
            let position = text[0];
            let id = text.slice(1);

            const positionParsed = parseDirection(position);
            const idParsed = parseInt(id);

            if (isNaN(idParsed)) {
                throw new Error(`Invalid RoadNode: ${text}`);
            }

            return new RoadNode(positionParsed, idParsed);
        } catch (error) {
            throw new Error(`Invalid RoadNode: ${text}`);
        }
    }

    connect(node: RoadNode) {
        this.connections.add(node);
    }
}

export { RoadNode };