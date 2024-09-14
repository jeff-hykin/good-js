import { iterZipLongSync } from "./iter_zip_long_sync.js"

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
    for (const each of iterZipLongSync(...iterables)) {
        yield [index++, ...each]
    }
}