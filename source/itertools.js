import { deepCopySymbol } from "./value.js"

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

export const makeIterable = function* (object) {
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

export const reverse = function (object) {
    // make a copy, then reverse it
    return [...makeIterable(object)].reverse()
}

export const zipIter = function* (...iterables) {
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
 * zip like python
 *
 * @return {Array[]} an array of arrays
 *
 * @example
 *     zip([1,2,3],[1,2])
 *     // [  [1,1], [2,2], [3,undefined]  ]
 */
export const zip = function (...iterables) {
    return [...zipIter(...iterables)]
}

/**
 * Count
 *
 * @return {Generator} an iterator of numbers
 *
 * @example
 *     countIter({start: 0, end: array.length-1, step: 1})
 */
export const countIter = function* ({ start = 0, end = Infinity, step = 1 }) {
    let count = start
    while (count <= end) {
        yield count
        count += step
    }
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
 * @return {Generator} iterator of pairs
 *
 * @example
 *     enumerateIter(['a','b'], ['A', 'B'])
 *     // [  [0,'a','A'],  [1,'b','B']  ]
 */
export const enumerateIter = function* (...iterables) {
    let index = 0
    for (const each of zipIter(...iterables)) {
        yield [index, ...each]
    }
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
 *     [...permuteIter([1,2,3])]
 *     // [[1,2,3],[2,1,3],[3,1,2],[1,3,2],[2,3,1],[3,2,1]]
 */
export const permuteIter = function* (elements) {
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
export const combinationsIter = function* (elements, maxLength, minLength) {
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
            yield* combinationsIter(elements, i, i)
        }
    } else {
        if (maxLength === 1) {
            yield* elements.map(each=>[each])
        } else {
            for (let i = 0; i < elements.length; i++) {
                for (const next of combinationsIter(elements.slice(i + 1, elements.length), maxLength - 1, maxLength - 1)) {
                    yield [elements[i], ...next]
                }
            }
        }
    }
}

const copyableInnerCombinations = function(elements, maxLength) {
    let iterator = {
        state: {
            index: 0,
            secondIndex: 0,
            iterator: null,
        },
        [deepCopySymbol]() {
            const theClone = {
                ...this,
                state: {...this.state},
            }
            if (this.state.iterator != null) {
                theClone.state.iterator = this.state.iterator[deepCopySymbol]()
            }
            theClone.next   = function(...args){ return this.next.apply(theClone, args) }
            theClone.return = function(...args){ return this.return.apply(theClone, args) }
            theClone.throw  = function(...args){ return this.throw.apply(theClone, args) }
            theClone[deepCopySymbol] = function(...args){ return this[deepCopySymbol].apply(theClone, args) }
            return theClone
        },
        return() {
            
        },
        catch() {
            
        },
        next() {
            if (this.state.index >= elements.length) {
                return {
                    done: true
                }
            }

            if (maxLength === 1) {
                return [ elements[this.state.index++] ]
            }
            
            const index = this.state.index
            this.state.index += 1
            // if first time, then we need to create the secondary iterator
            if (index === 0) {
                this.state.iterator = copyableInnerCombinations(elements.slice(index + 1, elements.length), maxLength - 1, maxLength - 1)
            }
            const next = this.state.iterator.next()
            if (next.done) {
                return next
            } else {
                return {
                    value: [ elements[index], ...next.value ],
                    done: false,
                }
            }
        },
    }
    iterator.next.bind(iterator)
    iterator.return.bind(iterator)
    iterator.throw.bind(iterator)
    iterator.clone.bind(iterator)
    return iterator
}
const copyableCombinationsIter = function* (elements, maxLength, minLength) {
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
            yield* copyableInnerCombinations(elements, i, i)
        }
    } else {
        yield* copyableInnerCombinations(elements, maxLength, minLength)
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
export const combinations = function(elements, maxLength, minLength) {
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
export const slices = function*(elements) {
    const slicePoints = count({ start: 1, end: numberOfPartitions.length-1 })
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

export const everythingExceptIter = function*({iterable, indicies}) {
    indicies = new Set(indicies)
    let index = 0
    for (const each of iterable) {
        if (!indicies.has(index++)) {
            yield each
        }
    }
}

export const combinationCutsIter = function* (elements, maxLength, minLength) {
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
            yield* combinationCutsIter(elements, i, i)
        }
    } else {
        if (maxLength === 1) {
            for (const i in elements) {
                console.debug(`i is: ${i}`,)
                yield [ [elements[i]], [...everythingExceptIter({iterable: elements, indicies:[i-0]})] ]
            }
        } else {
            for (const i in elements) {
                for (const [next, cutOut] of combinationCutsIter(elements.slice(i + 1, elements.length), maxLength - 1, maxLength - 1)) {
                    yield [ [elements[i], ...next], [...elements.slice(0,i), ...cutOut] ]
                }
            }
        }
    }
}

export const partitionsIter = function* (elements) {
    for (const [eachCombination, remaining] of combinationCutsIter(elements)) {
        if (remaining.length > 0) {
            for (const eachPossiblePartition of partitionsIter(remaining)) {
                yield [ eachCombination, ...eachPossiblePartition]
            }
        } else {
            yield [ eachCombination ]
        }
    }
}



// if (length == 1) {
//     yield [elements]
// } else if (length == 2) {
//     yield [ [elements[0]], [elements[1]] ]
// } else if (length == 3) {
//     for (let index = minLength; index <= maxLength; index++) {
//         for (const eachCombination of combinations(elements,index,index)) {
//             let remaining = [...elements]
//             for (const eachElement of eachCombination) {
//                 const index = remaining.indexOf(eachElement)
//                 delete remaining[index]
//             }
//         }
//     }
//     yield [ [elements[0]], [elements[1]], [elements[2]] ]
//     yield [ [elements[0]], [elements[1], elements[2]] ]
//     yield [ [elements[0], elements[1]], [elements[2]] ]
//     yield [ [elements[0], elements[2]], [elements[1]] ]
//     yield [ [elements[0], elements[1], elements[2]] ]
// }




// function(elements) {
//     const combinations = []
//     for (let index in elements) {
//         index-=0 // convert to number
//         combinations.push(combinationsIter(elements, index, index))
//     }



// }