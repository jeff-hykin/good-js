import { makeIterator } from "./make_iterator.js"

const innerIterZipLongAsync = async function* (...iterables) {
    const iterators = iterables.map(makeIterator)
    while (true) {
        const nexts = await Promise.all(iterators.map((each) => each.next()))
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
export const iterZipLongAsync = function(...iterables) {
    const generatorObject = innerIterZipLongAsync(...iterables)
    const finalLength = Math.max(...iterables.map((each) => typeof each != 'function' && (typeof each?.length == 'number' ? each?.length : each.size)))
    if (finalLength==finalLength) {
        generatorObject.length = finalLength
    }
    generatorObject[Symbol.iterator] = ()=>{
        throw Error(`You're trying to sync-iterate over an async iterator.\nUse "for await" insteaf of "for"\nor use \`asyncIteratorToList()\` `)
    }
    return generatorObject
}