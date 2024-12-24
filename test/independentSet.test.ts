import { MatrixGraph } from "../src/graph/MatrixGraph";
import { getIndependentSet, getAllIndependentSets } from "../src/graph/independentSet";

class Vertex {
    constructor(public id: number, public label: string) {}

    toString(): string {
        return `${this.label}${this.id}`;
    }
}

describe("IndependentSet", () => {
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

    it("should return an independent set", () => {
        graph.addEdge(vertexA, vertexB);
        graph.addEdge(vertexC, vertexD);

        const excluded = new Set<Vertex>();
        const independentSet = getIndependentSet(graph, excluded);

        expect(independentSet).toEqual(new Set([vertexA, vertexC]));
    });

    it("should return all independent sets", () => {
        graph.addEdge(vertexA, vertexB);
        graph.addEdge(vertexC, vertexD);

        const independentSets = getAllIndependentSets(graph);

        expect(independentSets).toEqual([new Set([vertexA, vertexC]), new Set([vertexB, vertexD])]);
    });

    it("should handle graphs with no edges", () => {
        const independentSets = getAllIndependentSets(graph);

        expect(independentSets).toEqual([new Set([vertexA, vertexB, vertexC, vertexD])]);
    });

    it("should handle fully connected graphs", () => {
        graph.addEdge(vertexA, vertexB);
        graph.addEdge(vertexA, vertexC);
        graph.addEdge(vertexA, vertexD);
        graph.addEdge(vertexB, vertexC);
        graph.addEdge(vertexB, vertexD);
        graph.addEdge(vertexC, vertexD);

        const independentSets = getAllIndependentSets(graph);

        expect(independentSets).toEqual([
            new Set([vertexA]),
            new Set([vertexB]),
            new Set([vertexC]),
            new Set([vertexD]),
        ]);
    });
});
