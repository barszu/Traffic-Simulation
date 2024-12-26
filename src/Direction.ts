/**
 * An enumeration representing the four cardinal directions.
 * @enum {string}
 */
enum Directions {
    North = "N",
    East = "E",
    South = "S",
    West = "W",
}

/**
 * An array containing the vertical directions (North and South).
 * @type {Directions[]}
 */
const verticalDirections = [Directions.North, Directions.South];

/**
 * An array containing the horizontal directions (East and West).
 * @type {Directions[]}
 */
const horizontalDirections = [Directions.East, Directions.West];

/**
 * Parses a string and returns the corresponding direction.
 *
 * @param {string} text - The string to parse.
 * @returns {Directions} - The parsed direction.
 * @throws {Error} - If the string does not represent a valid direction.
 */
function parseDirection(text: string): Directions {
    const direction = text.toUpperCase() as Directions;
    if (!Object.values(Directions).includes(direction)) {
        throw new Error(`Invalid direction: ${text}`);
    }
    return direction;
}

/**
 * Checks if two directions are aligned (both vertical or both horizontal).
 *
 * @param {Directions} a - The first direction.
 * @param {Directions} b - The second direction.
 * @returns {boolean} - True if the directions are aligned, false otherwise.
 */
function isSameAlign(a: Directions, b: Directions): boolean {
    return (
        (verticalDirections.includes(a) && verticalDirections.includes(b)) ||
        (horizontalDirections.includes(a) && horizontalDirections.includes(b))
    );
}

export { Directions, parseDirection, isSameAlign };
