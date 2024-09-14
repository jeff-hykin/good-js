import { isBuiltInSyncIterator } from "./is_built_in_sync_iterator.js"
import { isSyncIterable } from "./is_sync_iterable.js"

/**
 * almost certainly a sync iterator
 *
 * @example
 * ```js
 *     import { isSyncIteratorProbably } from ""https://deno.land/x/good/flattened/is_async_iterator_probably.js"
 * 
 *     const generatorFunc = function*() { yield 1; yield 2; yield 3; }
 *     const asyncGeneratorFunc = async function*() { yield 1; yield 2; yield 3; }
 *     const generatorObj = generatorFunc()
 *     const asyncGeneratorObj = generatorFunc()
 *     const syncIterator1 = { next: function() { return { done: false, value: 1 } } }
 *     const asyncIterator1 = { next: async function() { return { done: false, value: 1 } } }
 *     const asyncIterator2 = { next: function() { return Promise.resolve({ done: false, value: 1 }) } }
 *     const malformedSuperWeirdAsyncGeneratorObj = {
 *         // normal part (looks like async iterator)
 *         next: ()=>({ done: true, value: 1 }),
 *         [Symbol.asyncIterator]() { return this },
 *         // then for some reason also has this, (which doesnt return `this`)
 *         [Symbol.iterator]() { return iterator1 },
 *     }
 *     
 *     // false (good/correct answer)
 *     isSyncIteratorProbably(asyncGeneratorFunc)
 *     isSyncIteratorProbably(asyncGeneratorObj)
 *     isSyncIteratorProbably(generatorFunc)
 *     isSyncIteratorProbably(asyncIterator1)
 *      
 *     // false (bad/incorrect, but insanely unrealistic)
 *     isSyncIteratorProbably(malformedSuperWeirdSyncGeneratorObj)
 * 
 *     // true (good/correct)
 *     isSyncIteratorProbably(generatorObj)
 *     isSyncIteratorProbably(syncIterator1)
 *     
 *     // true (bad) - rare and impossible to detect reliably
 *     isSyncIteratorProbably(asyncIterator2)
 * ```
 *
 * @param value - any value
 * @returns {Boolean} output -
 */
export const isSyncIteratorProbably = function(value) {
    return typeof value?.next == 'function' && (
        isBuiltInSyncIterator(value) ||
        !value?.next instanceof AsyncFunction ||
        isSyncIterable(value)
    )
}