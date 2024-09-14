import { makeIterator } from "./make_iterator.js"
import { isBuiltInAsyncIterator } from "./is_built_in_async_iterator.js"
import { AsyncFunction } from "./async_function__class.js"
import { asyncIteratorToList } from "./async_iterator_to_list.js"
import { iterZipLongAsync } from "./iter_zip_long_async.js"

const safeZipLongSync = function* (...iterables) {
    const iterators = iterables.map(makeIterator)
    while (true) {
        const nexts = iterators.map((each) => each.next())
        if (nexts.some((each) => each instanceof Promise)) {
            throw Error(`So... there's a wierd problem going on here.\nOne of the iterators in zip() is a promise\nWhich means you can't zip().\nCall zipAsync() instead`)
        }
        // if all are done then stop
        if (nexts.every((each) => each.done)) {
            break
        }
        yield nexts.map((each) => each.value)
    }
}

/**
 * zip similarish to python
 *
 * @note
 *     if all the arguments have a length or size property, 
 *     then the output will be an array
 *     
 *     if arguments are iterables, then the output will be an iterable
 *     
 *     if arguments are proper async iterables (not polyfilled)
 *     then the output will be an async iterable
 *     
 *     if the arguments are async iterables, with lengths/sizes,
 *     the output will be a promise to an array, and (simultaneously)
 *     an async iterable.
 *
 * @example
 * ```js
 *     zipLong([1,2,3],[1,2])
 *     // [  [1,1], [2,2], [3,undefined]  ]
 * ```
 */
export const autoZipLong = function (...iterables) {
    const oneIsDefinitelyAsync = iterables.some((each) => each != null && (each instanceof Promise || typeof each[Symbol.asyncIterator] == 'function' || isBuiltInAsyncIterator(each) || each?.next instanceof AsyncFunction))
    if (oneIsDefinitelyAsync) {
        const generatorObject = iterZipLongAsync(...iterables)
        if (Number.isFinite(generatorObject?.length)) {
            // behaves as both a promise to a list and an async iterator (whatever is called first)
            // synchonously length-preserving
            return asyncIteratorToList(generatorObject)
        } else {
            return generatorObject
        }
    // presumably a sync iterator
    } else {
        const finalLength = Math.max(...iterables.map((each) => typeof each != 'function' && (typeof each?.length == 'number' ? each?.length : each.size)))
        let output = safeZipLongSync(...iterables)
        if (finalLength==finalLength) {
            output = [...output]
        }
        return output
    }
}