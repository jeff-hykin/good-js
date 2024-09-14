import { makeIterator } from "./make_iterator.js"

const innerIterZipLongSync = function* (...iterables) {
    const iterators = iterables.map(makeIterator)
    while (true) {
        const nexts = iterators.map((each) => each.next())
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
 * @return {Generator} an array of arrays
 *
 * @example
 * ```js
 *     [...zip([1,2,3],[1,2])]
 *     // [  [1,1], [2,2], [3,undefined]  ]
 * ```
 * 
 * @note
 *     If all the arguments have a length or size property, 
 *     then the generator will have a length property
 *     (the largest length of all the arguments)
 */
export const iterZipLongSync = function(...iterables) {
    const generatorObject = innerIterZipLongSync(...iterables)
    const finalLength = Math.max(...iterables.map((each) => typeof each != 'function' && (typeof each?.length == 'number' ? each?.length : each.size)))
    if (finalLength==finalLength) {
        generatorObject.length = finalLength
    }
    return generatorObject
}