import { iterZipLongSync as zip } from "./iter_zip_long_sync.js"

/**
 *
 * @example
 * ```js
 * console.log(rankedCompare([1, 2, 3], [1, 2, 3])) // 0
 * console.log(rankedCompare([1, 2, 3], [1, 1, 3])) // 1
 * console.log(rankedCompare([1, 2, 3], [1, 2, 4])) // -1
 * ```
 */
export function rankedCompare(a, b) {
    if (!(a instanceof Array)) {
        return 0
    }
    if (!(b instanceof Array)) {
        return 0
    }
    for (let [aNumber, bNumber] of zip(a, b)) {
        aNumber = aNumber||0
        bNumber = bNumber||0
        if (aNumber > bNumber) {
            return 1
        } else if (aNumber < bNumber) {
            return -1
        }
    }
    return 0
}