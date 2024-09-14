import { iterZipLongSync } from "./iter_zip_long_sync.js"

/**
 * stitch: long zip with array output
 *
 * @return {Array[]} an array of arrays
 *
 * @example
 * ```js
 *     stitch([1,2,3],[1,2])
 *     // [  [1,1], [2,2], [3,undefined]  ]
 * ```
 */
export const stitch = function (...iterables) {
    return [...iterZipLongSync(...iterables)]
}