import { count } from './count.js'

/**
 * Combinations
 *
 * @example
 * ```js
 *     let generator = combinationOfChoices([
 *         ['yes','no'],
 *         [1,2,3],
 *         ['a','b','c'],
 *     ])
 *     console.log(generator.next().value)
 *     // ['yes',1,'a']
 *     console.log(generator.next().value)
 *     // ['yes',1,'b']
 *     console.log(generator.next().value)
 *     // ['yes',1,'c']
 *     console.log(generator.next().value)
 *     // ['yes',2,'a']
 *     console.log(generator.next().value)
 *     // ['yes',2,'b']
 *     console.log(generator.next().value)
 *     // ['yes',2,'c']
 *     console.log(generator.next().value)
 *     // ['yes',3,'a']
 *     console.log(generator.next().value)
 *     // ['yes',3,'b']
 *     console.log(generator.next().value)
 *     // ['yes',3,'c']
 *     console.log(generator.next().value)
 *     // ['no',1,'a']
 *     console.log([...combinationOfChoices([
 *         ['yes','no'],
 *         [1,2,3],
 *         ['a','b','c'],
 *     ])])
 * ```
 */
export const combinationOfChoices = function* (possibleValuePerIndex) {
    if (!(possibleValuePerIndex instanceof Array) || possibleValuePerIndex.length === 0) {
        throw Error(`possibleValuePerIndex must be a non-empty array of non-empty arrays`)
    }
    if (!(possibleValuePerIndex[0] instanceof Array) || possibleValuePerIndex.some(each => each.length === 0)) {
        throw Error(`possibleValuePerIndex must be an array`)
    }
    // always first element
    yield possibleValuePerIndex.map(each=>each[0])
    
    const counters = Array(possibleValuePerIndex.length).fill(0)
    const optionsPerIndex = possibleValuePerIndex.map(each => each.length)
    const reversedIndex = [...count({start: 0, end: possibleValuePerIndex.length-1, step: 1})].reverse()
    while (true) {
        // increment with carry
        for (const digitIndex of reversedIndex) {
            counters[digitIndex] = counters[digitIndex] + 1
            // carry
            if (counters[digitIndex] >= optionsPerIndex[digitIndex]) {
                counters[digitIndex] = 0
                // reset
                if (digitIndex === 0) {
                    return
                }
            } else {
                break
            }
        }
        yield possibleValuePerIndex.map((each,index) => each[counters[index]])
    }
}