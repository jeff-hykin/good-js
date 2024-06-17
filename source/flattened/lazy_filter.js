import { makeIterable } from "./make_iterable.js"
import { isAsyncIterable } from "./is_async_iterable.js"

/**
 * lazy filter
 *
 * @example
 * ```js
 *     const iterable = filter([...Array(1000000)], each=>each%7==0)
 * ```
 */
export function lazyFilter(data, func) {
    data = makeIterable(data)
    let iterator
    if (isAsyncIterable(data) || func instanceof AsyncFunction) {
        iterator = (async function*(){
            let index = -1
            for await (const each of data) {
                if (await func(each, ++index)) {
                    yield each
                }
            }
        })()
    } else {
        iterator = (function*(){
            let index = -1
            for (const each of data) {
                if (func(each, ++index)) {
                    yield each
                }
            }
        })()
    }

    return iterator
}