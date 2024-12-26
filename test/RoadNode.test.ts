import { RoadNode } from "../src/RoadNode";
import { Directions } from "../src/Direction";

describe("RoadNode", () => {
    it("should create a RoadNode from a valid string", () => {
        const node = RoadNode.createFrom("N1");
        expect(node.position).toBe(Directions.North);
        expect(node.id).toBe(1);
    });

    it("should create a RoadNode from a valid string with multiple digits", () => {
        const node = RoadNode.createFrom("N1111");
        expect(node.position).toBe(Directions.North);
        expect(node.id).toBe(1111);
    });

    it("should throw an error for an invalid direction", () => {
        expect(() => RoadNode.createFrom("A1")).toThrow("Invalid RoadNode: A1");
    });

    it("should throw an error for an invalid id", () => {
        expect(() => RoadNode.createFrom("Na11bc")).toThrow("Invalid RoadNode: Na11bc");
    });

    it("should return the correct string representation", () => {
        const node = RoadNode.getInstance(Directions.East, 2);
        expect(node.toString()).toBe("E2");
    });

    it("should connect to another RoadNode", () => {
        const node1 = RoadNode.getInstance(Directions.North, 1);
        const node2 = RoadNode.getInstance(Directions.South, 2);
        node1.connect(node2);
        expect(node1.connections).toContain(node2);
    });

    it("should return the same instance for the same position and id", () => {
        const node1 = RoadNode.getInstance(Directions.North, 1);
        const node2 = RoadNode.getInstance(Directions.North, 1);
        expect(node1).toBe(node2);
    });

    it("should return different instances for different positions or ids", () => {
        const node1 = RoadNode.getInstance(Directions.North, 1);
        const node2 = RoadNode.getInstance(Directions.South, 1);
        const node3 = RoadNode.getInstance(Directions.North, 2);
        expect(node1).not.toBe(node2);
        expect(node1).not.toBe(node3);
    });
});
