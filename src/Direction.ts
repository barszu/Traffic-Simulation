enum Directions {
    North = 'N',
    East = 'E',
    South = 'S',
    West = 'W'
}

const verticalDirections = [Directions.North, Directions.South];
const horizontalDirections = [Directions.East, Directions.West];

function parseDirection(text: string): Directions {
    const direction = text.toUpperCase() as Directions;
    if (!Object.values(Directions).includes(direction)) {
        throw new Error(`Invalid direction: ${text}`);
    }
    return direction;
}

function isSameAlign(a: Directions, b: Directions): boolean {
    return verticalDirections.includes(a) && verticalDirections.includes(b) ||
        horizontalDirections.includes(a) && horizontalDirections.includes(b);
}

export { Directions, parseDirection, isSameAlign };