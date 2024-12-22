import { Directions, parseDirection, isSameAlign } from '../src/Direction';

describe('Directions', () => {
    it('should parse valid directions', () => {
        expect(parseDirection('N')).toBe(Directions.North);
        expect(parseDirection('E')).toBe(Directions.East);
        expect(parseDirection('S')).toBe(Directions.South);
        expect(parseDirection('W')).toBe(Directions.West);
    });

    it('should throw an error for invalid directions', () => {
        expect(() => parseDirection('A')).toThrow('Invalid direction: A');
        expect(() => parseDirection('1')).toThrow('Invalid direction: 1');
        expect(() => parseDirection('')).toThrow('Invalid direction: ');
        expect(() => parseDirection('north')).toThrow('Invalid direction: north');
        expect(() => parseDirection('easxsbbxjshxhjshjxbjkbsbxsjxt')).toThrow('Invalid direction: easxsbbxjshxhjshjxbjkbsbxsjxt');
    });

    it('should return true for same alignment directions', () => {
        expect(isSameAlign(Directions.North, Directions.South)).toBe(true);
        expect(isSameAlign(Directions.East, Directions.West)).toBe(true);
    });

    it('should return false for different alignment directions', () => {
        expect(isSameAlign(Directions.North, Directions.East)).toBe(false);
        expect(isSameAlign(Directions.South, Directions.West)).toBe(false);
    });
});