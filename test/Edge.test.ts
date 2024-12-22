import { Edge } from '../src/Edge';
import { RoadNode } from '../src/RoadNode';
import { Directions } from '../src/Direction';

describe('Edge', () => {
    it('should create an Edge from two RoadNodes', () => {
        const node1 = new RoadNode(Directions.North, 1);
        const node2 = new RoadNode(Directions.South, 2);
        const edge = new Edge(node1, node2);
        expect(edge.startNode).toBe(node1);
        expect(edge.destinationNode).toBe(node2);
        expect(node1.connections).toContain(node2);
    });

    it('should return the correct string representation', () => {
        const node1 = new RoadNode(Directions.East, 3);
        const node2 = new RoadNode(Directions.West, 4);
        const edge = new Edge(node1, node2);
        expect(edge.toString()).toBe('E3 -> W4');
    });

    it('should create an Edge from a valid string', () => {
        const edge = Edge.createFrom('N1 -> S2');
        expect(edge.startNode.position).toBe(Directions.North);
        expect(edge.startNode.id).toBe(1);
        expect(edge.destinationNode.position).toBe(Directions.South);
        expect(edge.destinationNode.id).toBe(2);
    });

    it('should create a reversed Edge', () => {
        const node1 = new RoadNode(Directions.North, 1);
        const node2 = new RoadNode(Directions.South, 2);
        const edge = new Edge(node1, node2);
        const reversedEdge = Edge.reversed(edge);
        expect(reversedEdge.startNode).toBe(node2);
        expect(reversedEdge.destinationNode).toBe(node1);
    });

    it('should add a car to the Edge', () => {
        const node1 = new RoadNode(Directions.North, 1);
        const node2 = new RoadNode(Directions.South, 2);
        const edge = new Edge(node1, node2);
        edge.addCar();
        expect(edge.getNumberOfCars()).toBe(1);
    });

    it('should remove a car from the Edge if there are cars', () => {
        const node1 = new RoadNode(Directions.North, 1);
        const node2 = new RoadNode(Directions.South, 2);
        const edge = new Edge(node1, node2);
        edge.addCar();
        edge.tryToRemoveCar();
        expect(edge.getNumberOfCars()).toBe(0);
    });

    it('should not remove a car from the Edge if there are no cars', () => {
        const node1 = new RoadNode(Directions.North, 1);
        const node2 = new RoadNode(Directions.South, 2);
        const edge = new Edge(node1, node2);
        edge.tryToRemoveCar();
        expect(edge.getNumberOfCars()).toBe(0);
    });
});