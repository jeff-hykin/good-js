import { combinations } from "./combinations.js"
import { count } from "./count.js"

/**
 * All Possible Slices
 *
 * @example
 * ```js
 *     slices([1,2,3])
 *     // [
 *     //   [[1],[2],[3]],
 *     //   [[1],[2,3]],
 *     //   [[1,2],[3]],
 *     //   [[1,2,3]],
 *     // ]
 *     // note: doesnt contain [[1,3], [2]]
 * ```
 */
export const slices = function* (elements) {
    const slicePoints = count({ start: 1, end: numberOfPartitions.length - 1 })
    for (const combination of combinations(slicePoints)) {
        combination.sort()
        let prev = 0
        const slices = []
        for (const eachEndPoint of [...combination, elements.length]) {
            slices.push(elements.slice(prev, eachEndPoint))
            prev = eachEndPoint
        }
        yield slices
    }
}