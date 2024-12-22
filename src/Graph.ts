import { RoadNode } from './RoadNode';
import { Edge } from './Edge';

interface Graph {   
    toString(): string;
    removeEdge(edge: Edge): void;
    addEdge(edge: Edge): void;
    getNeighbours(node: RoadNode): RoadNode[] | Set<RoadNode>;
}

class GraphMatrix implements Graph {
    readonly nodes: RoadNode[];
    readonly edges: Set<Edge>;
    readonly matrix: Array<Array<number>>;
    readonly traslator: Map<RoadNode, number> = new Map();

    constructor(nodes: RoadNode[] | Set<RoadNode>, edges: Set<Edge>) {
        this.nodes = nodes instanceof Set ? Array.from(nodes) : nodes;
        this.edges = edges;
        this.traslator = new Map(this.nodes.map((node, index) => [node, index])); // node -> index
        this.matrix = this.createMatrix();
    }

    protected createMatrix(): Array<Array<number>> {
        const n = this.nodes.length;
        const matrix = Array.from({ length: n }, () => Array.from({ length: n }, () => 0)); // Create n x n matrix filled with 0
        for (const edge of this.edges) {
            const start = this.traslator.get(edge.startNode) as number;
            const end = this.traslator.get(edge.destinationNode) as number;
            matrix[start][end] = 1;
        }
        return matrix;
    }

    toString(): string {
        let result = '';

        // Create header row
        const header = [' '].concat(this.nodes.map(node => node.toString())).join(' ');
        result += header + '\n';

        // Create matrix rows with node descriptions
        for (let i = 0; i < this.matrix.length; i++) {
            const row = [this.nodes[i].toString()].concat(this.matrix[i].map(num => num.toString())).join(' ');
            result += row + '\n';
        }

        return result;
    }

    removeEdge(edge: Edge) {
        if (!this.edges.has(edge)) {
            throw new Error('Edge does not exist in the graph');
        }

        const start = this.traslator.get(edge.startNode) as number;
        const end = this.traslator.get(edge.destinationNode) as number;

        // Remove edge from edges set
        this.edges.delete(edge);
        this.matrix[start][end] = 0;
    }

    addEdge(edge: Edge) {
        if (this.edges.has(edge)) {
            throw new Error('Edge already exists in the graph');
        }
        const start = this.traslator.get(edge.startNode)
        const end = this.traslator.get(edge.destinationNode)

        if (start === undefined || end === undefined) {
            throw new Error('Edge nodes do not exist in the graph');
        }

        // Add edge to edges set
        this.edges.add(edge);
        this.matrix[start][end] = 1;
    }

    getNeighbours(node: RoadNode): RoadNode[] {
        if (!this.traslator.has(node)) {
            throw new Error('Node does not exist in the graph');
        }

        const index = this.traslator.get(node) as number;
        const neighbours = this.matrix[index].reduce((acc, value, index) => {
            if (value === 1) {
                acc.push(this.nodes[index]);
            }
            return acc;
        }, [] as RoadNode[]);

        return neighbours;
    }
}

class GraphAdjectiveList implements Graph {
    protected readonly content = new Map<RoadNode, Set<RoadNode>>();

    constructor(edges: Set<Edge>) {
        edges.forEach((edge) => this.addEdge(edge));
    }

    getNeighbours(node: RoadNode): Set<RoadNode> {
        if (!this.content.has(node)) {
            throw new Error('Node does not exist in the graph');
        }

        const neighbours = this.content.get(node) as Set<RoadNode>;

        return neighbours
    }
    
    addEdge(edge: Edge): void {
        const start = edge.startNode;
        const end = edge.destinationNode;

        // add node's if they don't exist
        if (!this.content.has(start)) {
            this.content.set(start, new Set());
        }

        if (!this.content.has(end)) {
            this.content.set(end, new Set());
        }

        this.getNeighbours(start).add(end);
    }


    removeEdge(edge: Edge): void {
        const start = edge.startNode;
        const end = edge.destinationNode;

        if (!this.content.has(start) || !this.content.has(end)) {
            throw new Error('Edge does not exist in the graph');
        }

        this.getNeighbours(start).delete(end);
    }

    toString(): string {
        let result = '';

        for (const [node, neighbours] of this.content) {
            result += `${node.toString()} -> ${Array.from(neighbours).map(neighbour => neighbour.toString()).join(', ')}\n`;
        }

        return result;
    }



}

export { GraphMatrix, GraphAdjectiveList, Graph };