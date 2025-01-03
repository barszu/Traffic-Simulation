import { MatrixGraph } from "../src/graph/MatrixGraph";

class Vertex {
    constructor(public id: number, public label: string) {}

    toString(): string {
        return `${this.label}${this.id}`;
    }
}

describe("MatrixGraph1", () => {
    let graph: MatrixGraph<Vertex>;
    let vertexA: Vertex;
    let vertexB: Vertex;
    let vertexC: Vertex;
    let vertexD: Vertex;

    beforeEach(() => {
        vertexA = new Vertex(1, "A");
        vertexB = new Vertex(2, "B");
        vertexC = new Vertex(3, "C");
        vertexD = new Vertex(4, "D");
        const vertices = [vertexA, vertexB, vertexC, vertexD];
        graph = new MatrixGraph(vertices);
    });

    it("should add an edge between two vertices", () => {
        graph.addEdgeOneDirectional(vertexA, vertexB);
        expect(graph.hasEdgeOneDirectional(vertexA, vertexB)).toBe(true);
        expect(graph.hasEdgeOneDirectional(vertexB, vertexA)).toBe(false);
    });

    it("should add a bidirectional edge between two vertices", () => {
        graph.addEdge(vertexA, vertexB);
        expect(graph.hasEdgeOneDirectional(vertexA, vertexB)).toBe(true);
        expect(graph.hasEdgeOneDirectional(vertexB, vertexA)).toBe(true);
    });

    it("should return the correct neighbours for a vertex", () => {
        graph.addEdgeOneDirectional(vertexA, vertexB);
        graph.addEdgeOneDirectional(vertexA, vertexC);
        const neighbours = graph.getNeighbours(vertexA);
        expect(neighbours).toEqual(expect.arrayContaining([vertexB, vertexC]));
    });

    it("should throw an error if a vertex does not exist in the graph", () => {
        const vertexE = new Vertex(5, "E");
        expect(() => graph.addEdgeOneDirectional(vertexA, vertexE)).toThrow("Vertex does not exist in the graph");
        expect(() => graph.addEdgeOneDirectional(vertexE, vertexA)).toThrow("Vertex does not exist in the graph");
    });

    it("should throw an error if an index does not exist in the graph", () => {
        expect(() => (graph as any).vertexAt(10)).toThrow("Index does not exist in the graph");
    });

    it("should correctly map vertices to indices and back", () => {
        const indexA = (graph as any).indexOf(vertexA);
        const vertexAtA = (graph as any).vertexAt(indexA);
        expect(vertexAtA).toEqual(vertexA);
    });

    it("should correctly handle bidirectional edges", () => {
        graph.addEdge(vertexA, vertexB);
        expect(graph.hasEdge(vertexA, vertexB)).toBe(true);
        expect(graph.hasEdge(vertexB, vertexA)).toBe(true);
    });
});

describe("MatrixGraph2", () => {
    let graph: MatrixGraph<string>;

    beforeEach(() => {
        const vertices = ["A", "B", "C", "D"];
        graph = new MatrixGraph(vertices);
    });

    it("should add an edge between two vertices", () => {
        graph.addEdgeOneDirectional("A", "B");
        expect(graph.hasEdgeOneDirectional("A", "B")).toBe(true);
        expect(graph.hasEdgeOneDirectional("B", "A")).toBe(false);
    });

    it("should add a bidirectional edge between two vertices", () => {
        graph.addEdge("A", "B");
        expect(graph.hasEdgeOneDirectional("A", "B")).toBe(true);
        expect(graph.hasEdgeOneDirectional("B", "A")).toBe(true);
    });

    it("should return the correct neighbours for a vertex", () => {
        graph.addEdgeOneDirectional("A", "B");
        graph.addEdgeOneDirectional("A", "C");
        const neighbours = graph.getNeighbours("A");
        expect(neighbours).toEqual(expect.arrayContaining(["B", "C"]));
    });

    it("should throw an error if a vertex does not exist in the graph", () => {
        expect(() => graph.addEdgeOneDirectional("A", "E")).toThrow("Vertex does not exist in the graph");
        expect(() => graph.addEdgeOneDirectional("E", "A")).toThrow("Vertex does not exist in the graph");
    });

    it("should throw an error if an index does not exist in the graph", () => {
        expect(() => (graph as any).vertexAt(10)).toThrow("Index does not exist in the graph");
    });

    it("should correctly map vertices to indices and back", () => {
        const indexA = (graph as any).indexOf("A");
        const vertexA = (graph as any).vertexAt(indexA);
        expect(vertexA).toBe("A");
    });

    it("should correctly handle bidirectional edges", () => {
        graph.addEdge("A", "B");
        expect(graph.hasEdge("A", "B")).toBe(true);
        expect(graph.hasEdge("B", "A")).toBe(true);
    });
});
