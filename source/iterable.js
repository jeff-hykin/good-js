import { deepCopySymbol, typedArrayClasses, isAsyncIterable, AsyncFunction, ArrayIterator, isSyncIterableObjectOrContainer } from "./value.js"

// desired interface
    // light weight core:
        // iter
        // next
        // Stop
        // makeIterable
        // map
        // filter
        // flattened
        // forkBy
        // reduce
        // partitionBy
        // reversed
        // sortedBy
        // slice
    // Iterable() class
        // lengthIs
        // map
        // filter
        // flattened
        // reduce
        // paritionBy
        // forkBy
        // reversed
        // sortedBy
        // splice
        // slice
    // handy helpers
        // zip
        // count
        // enumerate
        // slices
        // permute
        // combinations
        // concurrentlyTransform
        // asyncIteratorToList

// 
// light weight
// 
    export const emptyIterator = (function*(){})()
    
    export const Stop = Symbol("iterationStop")

    export const iter = (object)=>{
        const iterable = makeIterable(object)
        if (iterable[Symbol.asyncIterator]) {
            return iterable[Symbol.asyncIterator]()
        } else {
            return iterable[Symbol.iterator]()
        }
    }
    
    const handleResult = ({value, done})=>done?Stop:value

    /**
     * next
     *
     * @param object - an iterator/generator (needs a next method)
     * @returns {Stop|any} output - will either be the stop symbol or will be the next value
     *
     * @example
     *     import { iter, next, Stop } from "https://deno.land/x/good/iterable.js"
     *     // Note: works on async iterators, and returns promises in that case
     *     const iterable = iter([1,2,3])
     *     next(iterable) // 1
     *     next(iterable) // 2
     *     next(iterable) // 3
     *     next(iterable) == Stop // true
     */
    export const next = (object)=>{
        if (object.next instanceof Function) {
            const result = object.next()
            if (result instanceof Promise) {
                return result.then(handleResult)
            } else {
                return handleResult(result)
            }
        } else {
            throw Error(`can't call next(object) on the following object as there is no object.next() method`, object)
        }
    }

    /**
     * ensure a value is iterable (e.g convert arg)
     */
    export const makeIterable = (object)=>{
        if (object == null) {
            return emptyIterator
        }
        // Array, Set, Map, string, Uint8Array, etc
        if (object[Symbol.iterator] instanceof Function || object[Symbol.asyncIterator] instanceof Function) {
            return object
        }
        
        // if pure object, iterate over entries
        if (Object.getPrototypeOf(object).constructor == Object) {
            return Object.entries(object)
        }

        // everything else (Date, RegExp, Boolean) becomes empty iterator
        return emptyIterator
    }
    
    /**
     * lazy map
     *
     * @example
     *     const iterable = map([...Array(1000000)], each=>each**2)
     */
    export function map(data, func) {
        data = makeIterable(data)
        let iterator
        if (isAsyncIterable(data) || func instanceof AsyncFunction) {
            iterator = (async function*(){
                let index = -1
                for await (const each of data) {
                    yield await func(each, ++index)
                }
            })()
        } else {
            iterator = (function*(){
                let index = -1
                for (const each of data) {
                    yield func(each, ++index)
                }
            })()
        }

        if (typeof data.size == 'number') {
            iterator.length = data.size
        }
        if (typeof data.length == 'number') {
            iterator.length = data.length
        }
        return iterator
    }
    
    /**
     * lazy filter
     *
     * @example
     *     const iterable = filter([...Array(1000000)], each=>each%7==0)
     */
    export function filter(data, func) {
        data = makeIterable(data)
        let iterator
        if (isAsyncIterable(data) || func instanceof AsyncFunction) {
            iterator = (async function*(){
                let index = -1
                for await (const each of data) {
                    if (await func(each, ++index)) {
                        yield each
                    }
                }
            })()
        } else {
            iterator = (function*(){
                let index = -1
                for (const each of data) {
                    if (func(each, ++index)) {
                        yield each
                    }
                }
            })()
        }

        return iterator
    }
    
    /**
     * flattens iterables/async iterables
     *
     *
     * @example
     *     var iterable = [ [1.1, 1.2], [2.1, 2.2], [[[[[3,4]]]]] ]
     *     // works even for indefinte-length iterables (generators)
     * 
     *     flattened({iterable: iterable})
     *     flattened({iterable: iterable, depth: 2})
     *     flattened({iterable: null }) // returns empty iterable 
     * 
     * @param arg1.iterable
     * @param arg1.depth
     * @param arg1.asyncsInsideSyncIterable - if the top level iterable is synchonous, but there are nested items that are async iterables, and you want to flatten those async iterables, then set this argument to true
     * @returns {Object} output - an iterable or async iterable (based on input)
     *
     */
    export function flattened({iterable, depth=Infinity, asyncsInsideSyncIterable=false}) {
        if (depth <= 0) {
            return iterable
        }
        iterable = makeIterable(iterable)
        if (asyncsInsideSyncIterable || iterable[Symbol.asyncIterator]) {
            return (async function*(){
                for await (const each of iterable) {
                    if (isAsyncIterable(each) || isSyncIterableObjectOrContainer(each)) {
                        for await (const eachChild of flattened({ iterable: each, depth: depth-1, asyncsInsideSyncIterable })) {
                            yield eachChild
                        }
                    } else {
                        yield each
                    }
                }
            })()
        } else {
            return (function*(){
                for (const each of iterable) {
                    if (isSyncIterableObjectOrContainer(each)) {
                        for (const eachChild of flattened({ iterable: each, depth: depth-1, })) {
                            yield eachChild
                        }
                    } else {
                        yield each
                    }
                }
            })()
        }
    }

    export function reversed(data) {
        // efficient iterator when the length is known (and all values are accessible)
        const isArrayOrString = data instanceof Array || typeof data == 'string'
        const isSet = data instanceof Set
        if (isArrayOrString || isSet) {
            const length = isArrayOrString ? data.length : data.size
            let lastIndex = length
            const iterator = (function*(){
                while (lastIndex > 0) {
                    yield data[--lastIndex]
                }
            })()
            iterator.length = length
            return iterator
        }
        
        // aggregate if necessary
        if (!isAsyncIterable(data)) {
            return [...data].reverse()
        } else {
            return asyncIteratorToList(data).then(data=>reversed(data))
        }
    }

    /**
     * split one iterable into multiple
     *
     * @example
     *     const { even, odd, divisBy3 } = forkBy({
     *         data: [1,2,3,4,5],
     *         filters: {
     *             even:     value=>value%2 == 0,
     *             odd:      value=>value%2 != 0,
     *             divisBy3: value=>value%3 == 0,
     *         },
     *     })
     *     console.log([...even     ]) // 2,4
     *     console.log([...odd      ]) // 1,3,5
     *     console.log([...divisBy3 ]) // 3
     *
     * @param arg1.data - an iterable/async iterable 
     * @param arg1.filters - an object of condition checkers
     * @param arg1.outputArrays - will return arrays instead of iterators if true (default false)
     * @returns {Object} output - an object with iterator attributes
     *
     */
    export function forkBy({data, filters, outputArrays=false}) {
        let isAsync = isAsyncIterable(data)
        const conditionHandlers = {}
        const iterator = iter(data)
        for (const [key, check] of Object.entries(filters)) {
            const que = [] 
            let index = 0
            if (isAsync || check instanceof AsyncFunction) {
                conditionHandlers[key] = new Iterable((async function*(){
                    while (1) {
                        // because iterator A can push to the que of all iterators
                        // it can also find an error for iterator B's checker function
                        // it then tells iterator B that it should throw an error, rather than throwing the error from iterator A
                        if (conditionHandlers[key].hitError) {
                            throw conditionHandlers[key].hitError
                        }
                        // if this que is empty, pull from main iterator
                        if (que.length == 0) {
                            const nextValue = await next(iterator)
                            if (nextValue == Stop) {
                                break
                            }
                            for (const [key, generator] of Object.entries(conditionHandlers)) {
                                let shouldPush = false
                                try {
                                    shouldPush = await generator.check(nextValue, index++)
                                } catch (error) {
                                    generator.hitError = error
                                }
                                if (shouldPush) {
                                    generator.que.push(nextValue)
                                }
                            }
                            // intentionally fall through to the next case
                        }

                        if (que.length != 0) {
                            // TODO: use a proper que instead of just a list
                            yield que.shift()
                        }
                    }
                })())
            } else {
                conditionHandlers[key] = new Iterable((function*(){
                    while (1) {
                        // because iterator A can push to the que of all iterators
                        // it can also find an error for iterator B's checker function
                        // it then tells iterator B that it should throw an error, rather than throwing the error from iterator A
                        if (conditionHandlers[key].hitError) {
                            throw conditionHandlers[key].hitError
                        }
                        // if this que is empty, pull from main iterator
                        if (que.length == 0) {
                            const nextValue = next(iterator)
                            if (nextValue == Stop) {
                                break
                            }
                            for (const [key, generator] of Object.entries(conditionHandlers)) {
                                let shouldPush = false
                                try {
                                    shouldPush = generator.check(nextValue, index++)
                                } catch (error) {
                                    generator.hitError = error
                                }
                                if (shouldPush) {
                                    generator.que.push(nextValue)
                                }
                            }
                            // intentionally fall through to the next case
                        }

                        if (que.length != 0) {
                            yield que.shift()
                        }
                    }
                })())
            }
            conditionHandlers[key].check = check
            conditionHandlers[key].hitError = false
            conditionHandlers[key].que = que
        }
        if (outputArrays) {
            for (const [key, value] of Object.entries(conditionHandlers)) {
                if (isAsyncIterable(value)) {
                    conditionHandlers[key] = asyncIteratorToList(value)
                } else {
                    conditionHandlers[key] = [...value]
                }
            }
        }
        return conditionHandlers
    }

// 
// Iterable Class
// 
    /**
     * itertools object
     *
     * @example
     *     let asyncGenerator = async function*() { yeild* [ 1,2,3,] }
     *     let result = await Iterable(asyncGenerator).map(
     *         async (each)=>readTextFile(`${each}.txt`)
     *     ).map(
     *         each=>each.startsWith("somePrefix")
     *     ).toArray
     *
     */
    export function Iterable(value, options={length:null, _createEmpty:false}) {
        // 
        // constructor that doesnt need "new"
        // 
            const { length, _createEmpty } = {length:null, _createEmpty:false, ...options }
            if (_createEmpty) {
                return this
            }
            const self = (this === undefined || this === globalThis) ? new Iterable(null, { _createEmpty: true }) : this

            if (value instanceof Array) {
                self.length = value.length
            } else if (value instanceof Set) {
                self.length = value.size
            } else if (typeof length == 'number') {
                self.length = length
            }
            self._source = makeIterable(value)
            if (self._source[Symbol.iterator]) {
                self[Symbol.iterator] = self._source[Symbol.iterator].bind(self._source)
            }
            if (self._source[Symbol.asyncIterator]) {
                self[Symbol.asyncIterator] = self._source[Symbol.asyncIterator].bind(self._source)
            }

            self[Symbol.isConcatSpreadable] = true

        // 
        // length
        // 
        self.lengthIs = function(length) {
            self.length = length
            return self
        }
        
        // 
        // map
        // 
        self.map = function(func) {
            const output = {
                ...self._source,
                [Symbol.iterator]: ()=>{
                    const iterator = iter(self._source)
                    let index = 0
                    return {
                        next() {
                            const { value, done } = iterator.next()
                            return {
                                value: done || func(value, index++),
                                done,
                            }
                        },
                    }
                },
            }
            const includeAsyncIterator = isAsyncIterable(self._source) || func instanceof AsyncFunction
            if (includeAsyncIterator) {
                output[Symbol.asyncIterator] = ()=>{
                    const iterator = iter(self._source)
                    let index = 0
                    return {
                        async next() {
                            const { value, done } = await iterator.next()
                            return {
                                value: done || await func(value, index++),
                                done,
                            }
                        },
                    }
                }
            }
            return new Iterable(output)
        }
        
        // 
        // filter
        // 
        self.filter = function(func) {
            const output = {
                ...self._source,
                [Symbol.iterator]: ()=>{
                    const iterator = iter(self._source)
                    let index = 0
                    return {
                        next() {
                            while (1) {
                                const result = iterator.next()
                                if (result.done || func(result.value, index++)) {
                                    return result
                                }
                            } 
                        },
                    }
                },
            }
            const includeAsyncIterator = isAsyncIterable(self._source) || func instanceof AsyncFunction
            if (includeAsyncIterator) {
                output[Symbol.asyncIterator] = ()=>{
                    const iterator = iter(self._source)
                    let index = 0
                    return {
                        async next() {
                            while (1) {
                                const result = await iterator.next()
                                if (result.done || await func(result.value, index++)) {
                                    return result
                                }
                            } 
                        },
                    }
                }
            }
            return new Iterable(output)
        }
        
        // 
        // fork
        // 
        self.forkBy = ({...args},...other)=>forkBy({...args, data: self}, ...other)

        // 
        // flattened
        // 
        self.flat = (depth=1, asyncsInsideSyncIterable=false)=>{
            return new Iterable(
                flattened({ iterable: self, depth, asyncsInsideSyncIterable  })
            )
        }
        
        // 
        // toArray (iterator to array)
        // 
        Object.defineProperties(self, {
            toArray: {
                get() {
                    if (self[Symbol.asyncIterator]) {
                        return ((async ()=>{
                            const iterator = self[Symbol.asyncIterator]()
                            const output = []
                            while (1) {
                                const { value, done } = await iterator.next()
                                if (done) {
                                    break
                                }
                                output.push(value)
                            }
                            return output
                        })())
                    } else {
                        return [...self]
                    }
                },
            },
            flattened: {
                get() {
                    return self.flat(Infinity)
                },
            },
        })
        return self
    }

// 
// handy helpers
// 
    export async function asyncIteratorToList(asyncIterator) {
        const results = []
        for await (const each of asyncIterator) {
            results.push(each)
        }
        return results
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
        iterables = iterables.map((each) => iter(each))
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
            yield [index++, ...each]
        }
    }

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