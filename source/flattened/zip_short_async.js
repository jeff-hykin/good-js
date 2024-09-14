import { asyncIteratorToList } from "./async_iterator_to_list.js"
import { iterZipShortAsync } from "./iter_zip_short_async.js"

/**
 * zip similarish to python
 *
 * @return {Generator} an array of arrays
 *
 * @example
 * ```js
 *     [...zip([1,2,3],[1,2])]
 *     // [  [1,1], [2,2], [3,undefined]  ]
 * ```
 */
export const zipShortAsync = function(...iterables) {
    // behaves as both a promise to a list and an async iterator (whatever is called first)
    return asyncIteratorToList(iterZipShortAsync(...iterables))
}