import { RoadNode } from '../src/RoadNode';
import { Directions } from '../src/Direction';

describe('RoadNode', () => {
    it('should create a RoadNode from a valid string', () => {
        const node = RoadNode.createFrom('N1');
        expect(node.position).toBe(Directions.North);
        expect(node.id).toBe(1);
    });

    it('should create a RoadNode from a valid string', () => {
        const node = RoadNode.createFrom('N1111');
        expect(node.position).toBe(Directions.North);
        expect(node.id).toBe(1111);
    });

    it('should throw an error for an invalid direction', () => {
        expect(() => RoadNode.createFrom('A1')).toThrow('Invalid RoadNode: A1');
    });

    it('should throw an error for an invalid id', () => {
        expect(() => RoadNode.createFrom('Na11bc')).toThrow('Invalid RoadNode: Na11bc');
    });

    it('should return the correct string representation', () => {
        const node = new RoadNode(Directions.East, 2);
        expect(node.toString()).toBe('E2');
    });

    it('should connect to another RoadNode', () => {
        const node1 = new RoadNode(Directions.North, 1);
        const node2 = new RoadNode(Directions.South, 2);
        node1.connect(node2);
        expect(node1.connections).toContain(node2);
    });

    it('should add a car to the RoadNode', () => {
        const node = new RoadNode(Directions.North, 1);
        node.addCar();
        expect(node.getNumberOfCars()).toBe(1);
    });

    it('should remove a car from the RoadNode if there are cars', () => {
        const node = new RoadNode(Directions.North, 1);
        node.addCar();
        node.tryToRemoveCar();
        expect(node.getNumberOfCars()).toBe(0);
    });

    it('should not remove a car from the RoadNode if there are no cars', () => {
        const node = new RoadNode(Directions.North, 1);
        node.tryToRemoveCar();
        expect(node.getNumberOfCars()).toBe(0);
    });
});