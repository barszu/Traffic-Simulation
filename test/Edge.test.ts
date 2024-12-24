import { Edge } from "../src/Edge";
import { RoadNode } from "../src/RoadNode";
import { Directions } from "../src/Direction";

describe("Edge", () => {
    it("should create an Edge from two RoadNodes", () => {
        const node1 = RoadNode.getInstance(Directions.North, 1);
        const node2 = RoadNode.getInstance(Directions.South, 2);
        const edge = Edge.getInstance(node1, node2);
        expect(edge.startNode).toBe(node1);
        expect(edge.destinationNode).toBe(node2);
        expect(node1.connections).toContain(node2);
    });

    it("should return the correct string representation", () => {
        const node1 = RoadNode.getInstance(Directions.East, 3);
        const node2 = RoadNode.getInstance(Directions.West, 4);
        const edge = Edge.getInstance(node1, node2);
        expect(edge.toString()).toBe("E3 -> W4");
    });

    it("should create an Edge from a valid string", () => {
        const edge = Edge.createFrom("N1 -> S2");
        expect(edge.startNode.position).toBe(Directions.North);
        expect(edge.startNode.id).toBe(1);
        expect(edge.destinationNode.position).toBe(Directions.South);
        expect(edge.destinationNode.id).toBe(2);
    });

    it("should create a reversed Edge", () => {
        const node1 = RoadNode.getInstance(Directions.North, 1);
        const node2 = RoadNode.getInstance(Directions.South, 2);
        const edge = Edge.getInstance(node1, node2);
        const reversedEdge = Edge.reversed(edge);
        expect(reversedEdge.startNode).toBe(node2);
        expect(reversedEdge.destinationNode).toBe(node1);
    });

    it("should add a car to the Edge", () => {
        const node1 = RoadNode.getInstance(Directions.North, 1);
        const node2 = RoadNode.getInstance(Directions.South, 2);
        const edge = Edge.getInstance(node1, node2);
        edge.addCar();
        expect(edge.getNumberOfCars()).toBe(1);
    });

    it("should not remove a car from the Edge if there are no cars", () => {
        const node1 = RoadNode.getInstance(Directions.North, 1);
        const node2 = RoadNode.getInstance(Directions.South, 2);
        const edge = Edge.getInstance(node1, node2);
        edge.tryToRemoveCar();
        expect(edge.getNumberOfCars()).toBe(0);
    });

    it("should return the same instance for the same nodes", () => {
        const node1 = RoadNode.getInstance(Directions.North, 1);
        const node2 = RoadNode.getInstance(Directions.South, 2);
        const edge1 = Edge.getInstance(node1, node2);
        const edge2 = Edge.getInstance(node1, node2);
        expect(edge1).toBe(edge2);
    });

    it("should create an Edge from a valid string and return the same instance", () => {
        const edge1 = Edge.createFrom("N1 -> S2");
        const edge2 = Edge.createFrom("N1 -> S2");
        expect(edge1).toBe(edge2);
    });
});
