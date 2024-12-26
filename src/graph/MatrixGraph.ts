/**
 * A class representing a graph using an adjacency matrix.
 *
 * @template T - The type of the vertices in the graph.
 */
class MatrixGraph<T> {
    readonly vertices: T[] = new Array();
    readonly verticesToIndex: Map<T, number> = new Map();
    readonly indexToVertices: Map<number, T> = new Map();

    readonly matrix: number[][];
    matrixDimensions: number;

    /**
     * Creates an instance of MatrixGraph.
     *
     * @param {T[]} vertices - The vertices of the graph.
     */
    constructor(vertices: T[]) {
        vertices.forEach((vertex, index) => {
            this.vertices.push(vertex);
            this.verticesToIndex.set(vertex, index);
            this.indexToVertices.set(index, vertex);
        });

        this.matrixDimensions = vertices.length;
        this.matrix = Array.from({ length: this.matrixDimensions }, () => Array(this.matrixDimensions).fill(0));
    }

    /**
     * Gets the index of a vertex.
     *
     * @private
     * @param {T} vertex - The vertex to get the index of.
     * @returns {number} - The index of the vertex.
     * @throws {Error} - If the vertex does not exist in the graph.
     */
    private indexOf(vertex: T): number {
        const index = this.verticesToIndex.get(vertex);
        if (index === undefined) {
            throw new Error("Vertex does not exist in the graph");
        }
        return index;
    }

    /**
     * Gets the vertex at a given index.
     *
     * @private
     * @param {number} index - The index to get the vertex at.
     * @returns {T} - The vertex at the given index.
     * @throws {Error} - If the index does not exist in the graph.
     */
    private vertexAt(index: number): T {
        const vertex = this.indexToVertices.get(index);
        if (vertex === undefined) {
            throw new Error("Index does not exist in the graph");
        }
        return vertex;
    }

    /**
     * Adds a one-directional edge between two vertices.
     *
     * @param {T} from - The starting vertex.
     * @param {T} to - The ending vertex.
     */
    addEdgeOneDirectional(from: T, to: T) {
        const fromIndex = this.indexOf(from);
        const toIndex = this.indexOf(to);
        this.matrix[fromIndex][toIndex] = 1;
    }

    /**
     * Adds a bidirectional edge between two vertices.
     *
     * @param {T} from - The first vertex.
     * @param {T} to - The second vertex.
     */
    addEdge(from: T, to: T) {
        this.addEdgeOneDirectional(from, to);
        this.addEdgeOneDirectional(to, from);
    }

    /**
     * Gets the neighbours of a vertex.
     *
     * @param {T} vertex - The vertex to get the neighbours of.
     * @returns {T[]} - An array of neighbouring vertices.
     */
    getNeighbours(vertex: T): T[] {
        const index = this.indexOf(vertex);

        const neighbours = this.matrix[index].reduce((acc, value, index) => {
            if (value === 1) {
                acc.push(this.vertexAt(index));
            }
            return acc;
        }, [] as T[]);

        return neighbours;
    }

    /**
     * Checks if there is a one-directional edge between two vertices.
     *
     * @param {T} from - The starting vertex.
     * @param {T} to - The ending vertex.
     * @returns {boolean} - True if there is a one-directional edge, false otherwise.
     */
    hasEdgeOneDirectional(from: T, to: T): boolean {
        const fromIndex = this.indexOf(from);
        const toIndex = this.indexOf(to);
        return this.matrix[fromIndex][toIndex] === 1;
    }

    /**
     * Checks if there is a bidirectional edge between two vertices.
     *
     * @param {T} from - The first vertex.
     * @param {T} to - The second vertex.
     * @returns {boolean} - True if there is a bidirectional edge, false otherwise.
     */
    hasEdge(from: T, to: T): boolean {
        return this.hasEdgeOneDirectional(from, to) && this.hasEdgeOneDirectional(to, from);
    }
}

export { MatrixGraph };
