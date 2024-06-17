import { makeIterable } from "./make_iterable.js"
import { isAsyncIterable } from "./is_async_iterable.js"

/**
 * lazy map
 *
 * @example
 * ```js
 * import { lazyMap } from "https://deno.land/x/good/flattened/lazy_map.js"
 * const iterable = lazyMap([...Array(1000000)], (each, index)=>each**2)
 * ```
 */
export function lazyMap(data, func) {
    data = makeIterable(data)
    let iterator
    if (isAsyncIterable(data)) {
        iterator = (async function*(){
            let index = -1
            for await (const each of data) {
                yield await func(each, ++index)
            }
        })()
    } else {
        iterator = (function*(){
            let index = -1
            for (const each of data) {
                yield func(each, ++index)
            }
        })()
    }

    if (typeof data.size == 'number') {
        iterator.length = data.size
    }
    if (typeof data.length == 'number') {
        iterator.length = data.length
    }
    return iterator
}