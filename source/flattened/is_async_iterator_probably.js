import { isBuiltInAsyncIterator } from "./is_built_in_async_iterator.js"
import { isAsyncIterable } from "./is_async_iterable.js"
import { AsyncFunction } from "./async_function__class.js"

/**
 * almost certainly an async iterator
 *
 * @example
 * ```js
 *     import { isAsyncIteratorProbably } from ""https://deno.land/x/good/flattened/is_async_iterator_probably.js"
 * 
 *     const generatorFunc = async function*() { yield 1; yield 2; yield 3; }
 *     const generatorObj = generatorFunc()
 *     const iterator1 = { next: async function() { return { done: false, value: 1 } } }
 *     const iterator2 = { next: function() { return Promise.resolve({ done: false, value: 1 }) } }
 *     const malformedSuperWeirdSyncGeneratorObj = {
 *         // normal part:
 *         next: ()=>({ done: true, value: 1 }),
 *         [Symbol.iterator]() { return this },
 *         // then for some reason also includes this:
 *         [Symbol.asyncIterator]() { return iterator1 },
 *     }
 *     
 *     // false (good)
 *     isAsyncIteratorProbably(generatorFunc)
 *     // false (bad) - very rare and impossible to detect reliably
 *     isAsyncIteratorProbably(iterator2)
 * 
 *     // true (good, generatorObj is iterator&iterable)
 *     isAsyncIteratorProbably(generatorObj)
 *     isAsyncIteratorProbably(iterator1)
 *     
 *     // true (bad, but insanely unrealistic)
 *     isAsyncIteratorProbably(malformedSuperWeirdSyncGeneratorObj)
 * ```
 *
 * @param value - any value
 * @returns {Boolean} output -
 */
export const isAsyncIteratorProbably = function(value) {
    return typeof value?.next == 'function' && (
        isBuiltInAsyncIterator(value) ||
        value?.next instanceof AsyncFunction ||
        isAsyncIterable(value)
    )
}