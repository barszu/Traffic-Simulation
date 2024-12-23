import { RoadNode } from "./RoadNode";
import { CarContainer } from "./util/CarContainer";

class Edge extends CarContainer {
    //aka polaczenie drogowe, nie zawiera tyle aut co pas
    private static instances: Map<string, Edge> = new Map();

    readonly startNode: RoadNode;
    readonly destinationNode: RoadNode;

    private constructor(from: RoadNode, to: RoadNode) {
        super();
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

            return Edge.getInstance(fromNode, toNode);
        } catch (error) {
            throw new Error(`Invalid Edge: ${text}`);
        }
    }

    static getInstance(from: RoadNode, to: RoadNode): Edge {
        const key = `${from.toString()} -> ${to.toString()}`;
        if (!Edge.instances.has(key)) {
            Edge.instances.set(key, new Edge(from, to));
        }
        return Edge.instances.get(key)!;
    }

    static reversed(edge: Edge): Edge {
        return Edge.getInstance(edge.destinationNode, edge.startNode);
    }
}

export { Edge };
