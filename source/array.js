import { makeIterable } from "./flattened/make_iterable.js"
import { count as countIter } from "./flattened/count.js"
import { enumerate as enumerateIter } from "./flattened/enumerate.js"
import { permute as permuteIter } from "./flattened/permute.js"
import { combinations as combinationsIter } from "./flattened/combinations.js"
import { slices as slicesIter } from "./flattened/slices.js"

// ideas
    // bundle (aka "chunk" from lodash)

import { wrapAroundGet } from "./flattened/wrap_around_get.js"; export { wrapAroundGet as wrapAroundGet }
import { reversed } from "./flattened/reversed.js"; export { reversed as reversed }
import { stitch } from "./flattened/stitch.js"; export { stitch as stitch }
import { iterZipLongSync } from "./flattened/iter_zip_long_sync.js"

/**
 * Count
 *
 * @return {Number[]} an array of numbers
 *
 * @example
 * ```js
 *     count({start: 0, end: array.length-1, step: 1})
 * ```
 */
export const count = function ({ start = 0, end = Infinity, step = 1 }) {
    return [...countIter({ start, end, step })]
}

/**
 * Enumerate like python
 *
 * @return {Array[]} an array of pairs
 *
 * @example
 * ```js
 *     enumerate(['a','b'], ['A', 'B'])
 *     // [  [0,'a','A'],  [1,'b','B']  ]
 * ```
 */
export const enumerate = function (...iterables) {
    return [...enumerateIter(...iterables)]
}

/**
 * Permutations
 *
 * @example
 * ```js
 *     permute([1,2,3])
 *     // [[1,2,3],[2,1,3],[3,1,2],[1,3,2],[2,3,1],[3,2,1]]
 * ```
 */
export const permute = function (elements) {
    return [...permuteIter(elements)]
}

/**
 * Combinations
 *
 * @example
 * ```js
 *     combinations([1,2,3])
 *     // [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
 *
 *     combinations([1,2,3], 2)
 *     // [[1,2],[1,3],[2,3]]
 *
 *     combinations([1,2,3], 3, 2)
 *     // [[1,2],[1,3],[2,3],[1,2,3]]
 * ```
 */
export const combinations = function (elements, maxLength, minLength) {
    return [...combinationsIter(elements, maxLength, minLength)]
}

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
    return [...slicesIter(elements, maxLength, minLength)]
}

export class NamedArray extends Array {
    toJSON() {
        return {...this}
    }
    toString() {
        return {...this}
    }
    [Symbol.for("customInspect")]() {
        return {...this}
    }
    [Symbol.for("Deno.customInspect")]() {
        return {...this}
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
        return {...this}
    }
}

export const zip = (...iterables)=>[...iterZipLongSync(...iterables)]