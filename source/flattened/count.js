/**
 * Count
 *
 * @return {Generator} an iterator of numbers
 *
 * @example
 * ```js
 *     count({start: 0, end: array.length-1, step: 1})
 * ```
 */
export const count = function* ({ start = 0, end = Infinity, step = 1 }) {
    let count = start
    while (count <= end) {
        yield count
        count += step
    }
}