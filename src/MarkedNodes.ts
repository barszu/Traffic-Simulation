import { RoadNode } from "./RoadNode";
import { Edge } from "./Edge";

class MarkedNodes {
    readonly content = new Map<RoadNode, number>();

    constructor(nodes: Set<RoadNode>) {
        nodes.forEach((node) => this.content.set(node, 0));
    }

    markEdge(edge: Edge) {
        if (
            !this.content.has(edge.startNode) ||
            !this.content.has(edge.destinationNode)
        ) {
            throw new Error("Node does not exist in the graph");
        }

        this.content.set(
            edge.startNode,
            (this.content.get(edge.startNode) as number) + 1
        );
        this.content.set(
            edge.destinationNode,
            (this.content.get(edge.destinationNode) as number) + 1
        );
    }

    isMarked(node: RoadNode) {
        return (this.content.get(node) as number) > 0;
    }
}

export { MarkedNodes };
