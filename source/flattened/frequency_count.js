import { makeIterable } from "./make_iterable.js"
import { isAsyncIterable } from "./is_async_iterable.js"

/**
 * frequency 
 *
 * @example
 * ```js
 *     const frequency = frequencyCount([11,11,44,44,9,44,0,0,1,99])
 *     console.log(frequency.get(11))
 *     // 2
 *     console.log(frequency)
 *     // Map {
 *     //     11 => 2,
 *     //     44 => 3,
 *     //     9 => 1,
 *     //     0 => 2,
 *     //     1 => 1,
 *     //     99 => 1
 *     // }
 *     const evenOddCount = frequencyCount([11,11,44,44,9,44,0,0,1,99], { valueToKey: (each)=>each%2 })
 *     console.log(evenOddCount)
 *     // Map(2) { 1 => 5, 0 => 5 }
 * ```
 * @returns {Map} output
 *
 */
export function frequencyCount(iterable, {valueToKey=null}={}) {
    iterable = makeIterable(iterable)
    valueToKey = valueToKey || ((each)=>each)
    if (isAsyncIterable(iterable)) {
        return (async function(){
            const counts = new Map()
            for await (let element of iterable) {
                element = valueToKey(element)
                counts.set(element, (counts.get(element)||0)+1)
            }
            return counts
        })()
    } else {
        const counts = new Map()
        for (let element of iterable) {
            element = valueToKey(element)
            counts.set(element, (counts.get(element)||0)+1)
        }
        return counts
    }
}