import { createPreset } from '../src/preset';
import { Directions } from '../src/Direction';

describe('createPreset', () => {
    it('should create nodes and edges from a valid preset', () => {
        const preset = ['N1 -> S2', 'E3 -> W4'];
        const [nodes, edges] = createPreset(preset);

        expect(nodes.size).toBe(4);
        expect(edges.size).toBe(2);

        const nodeArray = Array.from(nodes);
        expect(nodeArray).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ position: Directions.North, id: 1 }),
                expect.objectContaining({ position: Directions.South, id: 2 }),
                expect.objectContaining({ position: Directions.East, id: 3 }),
                expect.objectContaining({ position: Directions.West, id: 4 }),
            ])
        );

        const edgeArray = Array.from(edges);
        expect(edgeArray).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    startNode: expect.objectContaining({ position: Directions.North, id: 1 }),
                    destinationNode: expect.objectContaining({ position: Directions.South, id: 2 }),
                }),
                expect.objectContaining({
                    startNode: expect.objectContaining({ position: Directions.East, id: 3 }),
                    destinationNode: expect.objectContaining({ position: Directions.West, id: 4 }),
                }),
            ])
        );
    });

    it('should skip invalid lines and log warnings', () => {
        const preset = ['N1 -> S2', 'InvalidLine', 'E3 -> W4'];
        console.warn = jest.fn();

        const [nodes, edges] = createPreset(preset);

        expect(nodes.size).toBe(4);
        expect(edges.size).toBe(2);
        expect(console.warn).toHaveBeenCalledWith('Invalid line', 'InvalidLine', 'skipping...');
    });

    it('should skip reversing lines and log warnings', () => {
        const preset = ['N1 -> N1', 'E3 -> W4'];
        console.warn = jest.fn();

        const [nodes, edges] = createPreset(preset);

        expect(nodes.size).toBe(2);
        expect(edges.size).toBe(1);
        expect(console.warn).toHaveBeenCalledWith('Reversing line', 'N1 -> N1', 'skipping...');
    });
});