import { deepCopySymbol } from "./value.js"

// ideas
    // reduce
    // flatten(array,depth=Infinity)
    // subtract (different from set subtraction)

export const makeIterable = function* (object) {
    // if already iterable
    if (object instanceof Array || object instanceof Set) {
        yield* object
    } else if (object instanceof Map) {
        yield* object.entries()
    } else if (object instanceof Object) {
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

export async function asyncIteratorToList(asyncIterator) {
    const results = []
    for await (const each of asyncIterator) {
        results.push(each)
    }
    return results
}

// 
// adapted/enhanced version of https://github.com/denoland/deno_std/blob/215139c170cbcc0cb93fb9c463f63504cf7475b6/async/pool.ts
// 
/**
 * pooledMap transforms values from an (async) iterable into another async
 * iterable. The transforms are done concurrently, with a max concurrency
 * defined by the poolLimit.
 *
 * If an error is thrown from `transformFunction`, no new transformations will begin.
 * All currently executing transformations are allowed to finish and still
 * yielded on success. After that, the rejections among them are gathered and
 * thrown by the iterator in an `AggregateError`.
 *
 * @param args.iterator The input iterator for mapping.
 * @param args.poolLimit The maximum count of items being processed concurrently.
 * @param args.transformFunction The function to call for every item of the iterator.
 * @param args.awaitAll Whether or not to await all at the end
 * @return {AsyncIterator} 
 * @example
 *     for await (const subPaths of concurrentlyTransform({
 *        iterator: Deno.readDir("."), 
 *        transformFunction: (each, index)=>each.isDirectory&&[...Deno.readDirSync(each.name)],
 *     })) {
 *         if (subPaths) { console.log(subPaths) }
 *     }
 *     
 *     const listOfSubpaths = await concurrentlyTransform({
 *        iterator: Deno.readDir("."),
 *        awaitAll: true,
 *        transformFunction: (each, index)=>each.isDirectory&&[...Deno.readDirSync(each.name)],
 *     })
 */

const ERROR_WHILE_MAPPING_MESSAGE = "Threw while mapping.";
export function concurrentlyTransform({iterator, transformFunction, poolLimit=null, awaitAll=false}) {
    poolLimit = poolLimit || concurrentlyTransform.defaultPoolLimit
    // Create the async iterable that is returned from this function.
    const res = new TransformStream({
        async transform(p, controller) {
            try {
                const s = await p
                controller.enqueue(s)
            } catch (e) {
                if (
                    e instanceof AggregateError &&
                    e.message == ERROR_WHILE_MAPPING_MESSAGE
                ) {
                    controller.error(e)
                }
            }
        },
    })
    
    // Start processing items from the iterator
    const mainPromise = (async () => {
        const writer = res.writable.getWriter()
        const executing = []
        try {
            let index = 0
            for await (const item of iterator) {
                const p = Promise.resolve().then(() => transformFunction(item, index))
                index++
                // Only write on success. If we `writer.write()` a rejected promise,
                // that will end the iteration. We don't want that yet. Instead let it
                // fail the race, taking us to the catch block where all currently
                // executing jobs are allowed to finish and all rejections among them
                // can be reported together.
                writer.write(p);
                const e = p.then(() =>executing.splice(executing.indexOf(e), 1))
                executing.push(e)
                if (executing.length >= poolLimit) {
                    await Promise.race(executing)
                }
            }
            // Wait until all ongoing events have processed, then close the writer.
            await Promise.all(executing)
            writer.close()
        } catch {
            const errors = []
            for (const result of await Promise.allSettled(executing)) {
                if (result.status == "rejected") {
                    errors.push(result.reason)
                }
            }
            writer.write(Promise.reject(
                new AggregateError(errors, ERROR_WHILE_MAPPING_MESSAGE),
            )).catch(() => {})
        }
    })()
    const asyncIterator = res.readable[Symbol.asyncIterator]()
    if (!awaitAll) {
        return asyncIterator
    } else {
        return mainPromise.then(()=>asyncIteratorToList(asyncIterator))
    }
}
concurrentlyTransform.defaultPoolLimit = 40 // my best guess at an average-optimal number of parallel workers