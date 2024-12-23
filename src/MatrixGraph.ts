class MatrixGraph<T> {
    readonly vertices: T[] = new Array();
    readonly verticesToIndex: Map<T, number> = new Map();
    readonly indexToVertices: Map<number, T> = new Map();

    readonly matrix: number[][];
    matrixDimensions: number;

    constructor(vertices: T[]) {
        vertices.forEach((vertex, index) => {
            this.vertices.push(vertex);
            this.verticesToIndex.set(vertex, index);
            this.indexToVertices.set(index, vertex);
        });

        this.matrixDimensions = vertices.length;
        this.matrix = Array.from({ length: this.matrixDimensions }, () => Array(this.matrixDimensions).fill(0));
    }

    private indexOf(vertex: T): number {
        const index = this.verticesToIndex.get(vertex);
        if (index === undefined) {
            throw new Error("Vertex does not exist in the graph");
        }
        return index;
    }

    private vertexAt(index: number): T {
        const vertex = this.indexToVertices.get(index);
        if (vertex === undefined) {
            throw new Error("Index does not exist in the graph");
        }
        return vertex;
    }

    addEdge(from: T, to: T) {
        const fromIndex = this.indexOf(from);
        const toIndex = this.indexOf(to);
        this.matrix[fromIndex][toIndex] = 1;
    }

    addEdgeBiDirectional(from: T, to: T) {
        this.addEdge(from, to);
        this.addEdge(to, from);
    }

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

    hasEdge(from: T, to: T): boolean {
        const fromIndex = this.indexOf(from);
        const toIndex = this.indexOf(to);
        return this.matrix[fromIndex][toIndex] === 1;
    }

    hasEdgeBiDirectional(from: T, to: T): boolean {
        return this.hasEdge(from, to) && this.hasEdge(to, from);
    }
}

export { MatrixGraph };
