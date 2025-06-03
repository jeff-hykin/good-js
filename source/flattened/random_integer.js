/**
 * Returns a random integer between the specified inclusive minimum and maximum values.
 *
 * @param {number} min - The minimum integer value (inclusive).
 * @param {number} max - The maximum integer value (inclusive).
 * @returns {number} A random integer between min and max (inclusive).
 *
 * @example
 * ```js
 * randomInteger(1, 5); // Might return 1, 2, 3, 4, or 5
 * ```
 */
export function randomInteger(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}
