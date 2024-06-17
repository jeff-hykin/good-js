import { IteratorPrototype } from "./iterator_prototype__class.js"

/**
 * isBuiltInIterator
 * @note
 *     it is excptionally rare that this should be used
 *     see isSyncIterableObjectOrContainer() for likely usecase
 * @param value - any value
 * @example
 * ```js
 *     // false
 *     isBuiltInIterator(new Map())
 *     isBuiltInIterator([])
 *     
 *     // true
 *     isBuiltInIterator((new Map())[Symbol.iterator]())
 *     isBuiltInIterator((new Set())[Symbol.iterator]())
 * ```
 */
export const isBuiltInIterator = (value)=>IteratorPrototype.isPrototypeOf(value)