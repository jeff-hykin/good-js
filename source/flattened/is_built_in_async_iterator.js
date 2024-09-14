import { asyncIteratorPrototype } from "./async_iterator_prototype.js"

/**
 * isBuiltInAsyncIterator
 * @note
 *     it is excptionally rare that this should be used
 *     see isSyncIterableObjectOrContainer() for likely usecase
 * @param value - any value
 * @example
 * ```js
 *     const generatorFunction = async function*() { yield 1; yield 2; yield 3; }
 * 
 *     // false
 *     isBuiltInAsyncIterator(generatorFunction)
 * 
 *     // true
 *     isBuiltInAsyncIterator(generatorFunction()) 
 * 
 *     // false
 *     isBuiltInAsyncIterator(new Map())
 *     isBuiltInAsyncIterator([])
 *     
 *     // false
 *     isBuiltInAsyncIterator((new Map())[Symbol.iterator]())
 *     isBuiltInAsyncIterator((new Set())[Symbol.iterator]())
 * ```
 */
export const isBuiltInAsyncIterator = asyncIteratorPrototype.isPrototypeOf.bind(asyncIteratorPrototype)
// the false is for cases where the runtime does not support async iterators