import { makeIterable } from "./make_iterable.js"
import { isAsyncIterable } from "./is_async_iterable.js"
import { AsyncFunction } from "./async_function__class.js"

/**
 * reduce (for iterables & async iterables)
 *
 * @example
 * ```js
 *     const total = reduce(
 *         [...Array(1000000)],
 *         (each, index, returnValue=0)=>returnValue+index
 *     )
 * ```
 */
export function reduce(data, func) {
    data = makeIterable(data)
    let iterator
    if (isAsyncIterable(data) || func instanceof AsyncFunction) {
        return (async function(){
            let index = -1
            let value
            for await (const each of data) {
                index++
                if (index == -1) {
                    value = await func(each, index)
                } else {
                    value = await func(each, index, value)
                }
            }
            return value
        })()
    } else {
        let index = -1
        let value
        for (const each of data) {
            index++
            if (index == -1) {
                value = func(each, index)
            } else {
                value = func(each, index, value)
            }
        }
        return value
    }
}