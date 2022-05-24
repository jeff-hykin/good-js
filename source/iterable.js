import { deepCopySymbol } from "./value.js"

// ideas
    // reduce
    // flatten(array,depth=Infinity)
    // subtract (different from set subtraction)

export const makeIterable = function* (object) {
    // if already iterable
    if (object instanceof Array || object instanceof Set) {
        yield* object
    }
    // map edgecase
    if (object instanceof Map) {
        yield* object.entries()
    }
    if (object instanceof Object) {
        // Array, Set, string, custom classes, etc
        if (object[Symbol.iterator] instanceof Function) {
            yield* object
            // pure objects
        } else {
            yield* Object.entries(object)
        }
    }
}


export const map = function* (iterable, func) {
    iterable = makeIterable(iterable)
    for (const each of iterable) {
        yield func(each)
    }
}

export const filter = function* (iterable, func) {
    iterable = makeIterable(iterable)
    for (const each of iterable) {
        if (func(each)) {
            yield each
        }
    }
}

/**
 * zip similar to python
 *
 * @return {Generator} an array of arrays
 *
 * @example
 *     [...zip([1,2,3],[1,2])]
 *     // [  [1,1], [2,2], [3,undefined]  ]
 */
export const zip = function* (...iterables) {
    iterables = iterables.map((each) => makeIterable(each))
    while (true) {
        const nexts = iterables.map((each) => each.next())
        // if all are done then stop
        if (nexts.every((each) => each.done)) {
            break
        }
        yield nexts.map((each) => each.value)
    }
}

/**
 * Count
 *
 * @return {Generator} an iterator of numbers
 *
 * @example
 *     count({start: 0, end: array.length-1, step: 1})
 */
export const count = function* ({ start = 0, end = Infinity, step = 1 }) {
    let count = start
    while (count <= end) {
        yield count
        count += step
    }
}

/**
 * Enumerate like python
 *
 * @return {Generator} iterator of pairs
 *
 * @example
 *     enumerate(['a','b'], ['A', 'B'])
 *     // [  [0,'a','A'],  [1,'b','B']  ]
 */
export const enumerate = function* (...iterables) {
    let index = 0
    for (const each of zip(...iterables)) {
        yield [index, ...each]
    }
}

// TODO: flatIterator

/**
 * Permutations
 *
 * @example
 *     [...permute([1,2,3])]
 *     // [[1,2,3],[2,1,3],[3,1,2],[1,3,2],[2,3,1],[3,2,1]]
 */
export const permute = function* (elements) {
    yield elements.slice()
    const length = elements.length
    const c = new Array(length).fill(0)
    let i = 1,
        k,
        p

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i]
            p = elements[i]
            elements[i] = elements[k]
            elements[k] = p
            ++c[i]
            i = 1
            yield elements.slice()
        } else {
            c[i] = 0
            ++i
        }
    }
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
export const combinations = function* (elements, maxLength, minLength) {
    // derived loosely from: https://lowrey.me/es6-javascript-combination-generator/
    if (maxLength === minLength && minLength === undefined) {
        minLength = 1
        maxLength = elements.length
    } else {
        maxLength = maxLength || elements.length
        minLength = minLength === undefined ? maxLength : minLength
    }

    if (minLength !== maxLength) {
        for (let i = minLength; i <= maxLength; i++) {
            yield* combinations(elements, i, i)
        }
    } else {
        if (maxLength === 1) {
            yield* elements.map((each) => [each])
        } else {
            for (let i = 0; i < elements.length; i++) {
                for (const next of combinations(elements.slice(i + 1, elements.length), maxLength - 1, maxLength - 1)) {
                    yield [elements[i], ...next]
                }
            }
        }
    }
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
    const slicePoints = count({ start: 1, end: numberOfPartitions.length - 1 })
    for (const combination of combinations(slicePoints)) {
        combination.sort()
        let prev = 0
        const slices = []
        for (const eachEndPoint of [...combination, elements.length]) {
            slices.push(elements.slice(prev, eachEndPoint))
            prev = eachEndPoint
        }
        yield slices
    }
}