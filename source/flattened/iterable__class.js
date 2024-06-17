import { isAsyncIterable } from "./is_async_iterable.js"
import { AsyncFunction } from "./async_function__class.js"
import { iter } from "./iter.js"
import { lazyFlatten } from "./lazy_flatten.js"
import { asyncIteratorToList } from "./async_iterator_to_list.js"
import { makeIterable } from "./make_iterable.js"
import { next } from "./next.js"
import { stop } from "./stop_symbol.js"

/**
 * split one iterable into multiple
 *
 * @example
 * ```js
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
 * ```
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
                        if (nextValue == stop) {
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
                        if (nextValue == stop) {
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

/**
 * itertools object
 *
 * @example
 * ```js
 *     let asyncGenerator = async function*() { yield* [ 1,2,3,] }
 *     let result = await Iterable(asyncGenerator).map(
 *         async (each)=>readTextFile(`${each}.txt`)
 *     ).map(
 *         each=>each.startsWith("somePrefix")
 *     ).toArray
 * ```
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
    self.lengthIs = function(length) { // TODO: deprecated
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
            lazyFlatten({ iterable: self, depth, asyncsInsideSyncIterable  })
        )
    }
    
    // 
    // then
    //
    self.then = (func)=>{
        const output = {
            ...self._source,
            [Symbol.iterator]: ()=>{
                const iterator = iter(self._source)
                let index = -1
                return {
                    next() {
                        const output = iterator.next()
                        index++
                        if (output.done) {
                            func(self, index)
                        }
                        return output
                    },
                }
            },
        }
        const includeAsyncIterator = isAsyncIterable(self._source)
        if (includeAsyncIterator) {
            output[Symbol.asyncIterator] = ()=>{
                const iterator = iter(self._source)
                let index = -1
                return {
                    async next() {
                        const output = await iterator.next()
                        index++
                        if (output.done) {
                            await func(self, index)
                        }
                        return output
                    },
                }
            }
        }
        return new Iterable(output)
    }
    
    // 
    // finally
    // 
    self.finally = (func)=>{
        const output = {
            ...self._source,
            [Symbol.iterator]: ()=>{
                const iterator = iter(self._source)
                let index = -1
                return {
                    next() {
                        let output = { value: null, done: true }
                        try {
                            output = iterator.next()
                            index++
                        } finally {
                            if (output.done) {
                                func(self, index)
                            }
                        }
                    },
                }
            },
        }
        const includeAsyncIterator = isAsyncIterable(self._source)
        if (includeAsyncIterator) {
            output[Symbol.asyncIterator] = ()=>{
                const iterator = iter(self._source)
                let index = 0
                return {
                    async next() {
                        let output = { value: null, done: true }
                        try {
                            output = await iterator.next()
                            index++
                        } finally {
                            if (output.done) {
                                await func(self, index)
                            }
                        }
                    },
                }
            }
        }
        return new Iterable(output)
    }
    
    // 
    // toArray (iterator to array)
    // 
    Object.defineProperties(self, {
        toArray: { // TODO: make this a method
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