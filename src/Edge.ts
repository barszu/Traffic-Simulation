import { RoadNode } from "./RoadNode";
import { CarContainer } from "./util/CarContainer";

class Edge extends CarContainer { //aka polaczenie drogowe, nie zawiera tyle aut co pas
    readonly startNode: RoadNode;
    readonly destinationNode: RoadNode;


    constructor(from: RoadNode, to: RoadNode) {
        super()
        this.startNode = from;
        this.destinationNode = to;

        from.connect(to);
    }

    public toString(): string {
        return `${this.startNode} -> ${this.destinationNode}`;
    }

    public static createFrom(text: string): Edge {
        try {
            const [from, to] = text.split(" -> ");
            const fromNode = RoadNode.createFrom(from);
            const toNode = RoadNode.createFrom(to);

            fromNode.connect(toNode);
            toNode.connect(fromNode);

            return new Edge(fromNode, toNode);
        } catch (error) {
            throw new Error(`Invalid Edge: ${text}`);
        }
    }

    static reversed(edge: Edge): Edge {
        return new Edge(edge.destinationNode, edge.startNode);
    }
}

export { Edge };