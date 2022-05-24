import {
    makeIterable,
    zip as zipIter,
    count as countIter,
    enumerate as enumerateIter,
    permute as permuteIter,
    combinations as combinationsIter,
    slices as slicesIter,
} from "./iterable.js"

// ideas
    // bundle (lodash chunk)

/**
 * wrapAroundGet
 *
 * @example
 *     const items = [9,5,3]
 *     wrapAroundGet(0,items) // 9
 *     wrapAroundGet(1,items) // 5
 *     wrapAroundGet(2,items) // 3
 *     wrapAroundGet(3,items) // 9
 *     wrapAroundGet(4,items) // 5
 */
export const wrapAroundGet = (number, list) => list[((number % list.length) + list.length) % list.length]

export const reverse = function (object) {
    // make a copy, then reverse it
    return [...makeIterable(object)].reverse()
}

/**
 * zip like python
 *
 * @return {Array[]} an array of arrays
 *
 * @example
 *     zip([1,2,3],[1,2])
 *     // [  [1,1], [2,2], [3,undefined]  ]
 */
export const zip = function (...iterables) {
    for (let each of zipIter(...iterables)) {
        console.debug(`each is:`,each)
    }
    return [...zipIter(...iterables)]
}

/**
 * Count
 *
 * @return {Number[]} an array of numbers
 *
 * @example
 *     count({start: 0, end: array.length-1, step: 1})
 */
export const count = function ({ start = 0, end = Infinity, step = 1 }) {
    return [...countIter({ start, end, step })]
}

/**
 * Enumerate like python
 *
 * @return {Array[]} an array of pairs
 *
 * @example
 *     enumerate(['a','b'], ['A', 'B'])
 *     // [  [0,'a','A'],  [1,'b','B']  ]
 */
export const enumerate = function (...iterables) {
    return [...enumerateIter(...iterables)]
}

// TODO: flatIterator

/**
 * Permutations
 *
 * @example
 *     permute([1,2,3])
 *     // [[1,2,3],[2,1,3],[3,1,2],[1,3,2],[2,3,1],[3,2,1]]
 */
export const permute = function (elements) {
    return [...permuteIter(elements)]
}

/**
 * Combinations
 *
 * @example
 *     combinations([1,2,3])
 *     // [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
 *
 *     combinations([1,2,3], 2)
 *     // [[1,2],[1,3],[2,3]]
 *
 *     combinations([1,2,3], 3, 2)
 *     // [[1,2],[1,3],[2,3],[1,2,3]]
 */
export const combinations = function (elements, maxLength, minLength) {
    return [...combinationsIter(elements, maxLength, minLength)]
}

/**
 * All Possible Slices
 *
 * @example
 *     slices([1,2,3])
 *     // [
 *     //   [[1],[2],[3]],
 *     //   [[1],[2,3]],
 *     //   [[1,2],[3]],
 *     //   [[1,2,3]],
 *     // ]
 *     // note: doesnt contain [[1,3], [2]]
 */
export const slices = function* (elements) {
    return [...slicesIter(elements, maxLength, minLength)]
}
