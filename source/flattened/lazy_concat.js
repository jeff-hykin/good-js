import { makeIterable } from "./make_iterable.js"
import { isAsyncIterable } from "./is_async_iterable.js"

/**
 * lazy concat
 *
 * @example
 * ```js
 * import { lazyConcat } from "https://deno.land/x/good/flattened/lazy_concat.js"
 * const iterable = lazyConcat([...Array(1000000)], [...Array(1000000)])
 * ```
 */
export function lazyConcat(...iterables) {
    iterables = iterables.map(makeIterable)
    let iterator
    if (iterables.some(isAsyncIterable)) {
        iterator = (async function*(){
            for (const each of iterables) {
                for await (const eachItem of each) {
                    yield eachItem
                }
            }
        })()
    } else {
        iterator = (function*(){
            for (const each of iterables) {
                yield* each
            }
        })()
    }
    // has length
    if (iterables.every(each=>typeof each.length == 'number' && each.length === each.length)) {
        let totalLength = 0
        for (const each of iterables) {
            totalLength += each.length
        }
        iterator.length = totalLength
    }

    return iterator
}