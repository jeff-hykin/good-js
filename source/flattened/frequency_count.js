import { makeIterable } from "./make_iterable.js"
import { isAsyncIterable } from "./is_async_iterable.js"

/**
 * frequency 
 *
 * @example
 * ```js
 *     const frequency = frequencyCount([11,11,44,44,9,44,0,0,1,99])
 *     // Map {
 *     //     11 => 2,
 *     //     44 => 3,
 *     //     9 => 1,
 *     //     0 => 2,
 *     //     1 => 1,
 *     //     99 => 1
 *     // }
 * ```
 * @returns {Map} output
 *
 */
export function frequencyCount(iterable) {
    iterable = makeIterable(iterable)
    if (isAsyncIterable(iterable)) {
        return (async function(){
            const counts = new Map()
            for await (const element of iterable) {
                counts.set(element, (counts.get(element)||0)+1)
            }
            return counts
        })()
    } else {
        const counts = new Map()
        for (const element of iterable) {
            counts.set(element, (counts.get(element)||0)+1)
        }
        return counts
    }
}