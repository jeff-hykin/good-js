import { zip } from "./zip.js"

/**
 * Enumerate like python
 *
 * @return {Generator} iterator of pairs
 *
 * @example
 * ```js
 *     enumerate(['a','b'], ['A', 'B'])
 *     // [  [0,'a','A'],  [1,'b','B']  ]
 * ```
 */
export const enumerate = function* (...iterables) {
    let index = 0
    for (const each of zip(...iterables)) {
        yield [index++, ...each]
    }
}