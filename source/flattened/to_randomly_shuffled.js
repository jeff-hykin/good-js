import { randomlyShuffle } from './randomly_shuffle.js'

/**
 * will return a randomly shuffled copy of an array
 *
 * @example
 * ```js
 * var a = [1, 2, 3]
 * var b = toRandomlyShuffled(a)
 * console.log(a) // [1, 2, 3]
 * console.log(b) // [1, 3, 2]
 * ```
 * 
 * @note
 * uses Fisher-Yates algorithm
 */
export function toRandomlyShuffled(arr) {
    randomlyShuffle(arr=[...arr])
    return arr
}