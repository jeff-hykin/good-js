import { isBuiltInSyncIterator } from "./is_built_in_sync_iterator.js"
import { isBuiltInAsyncIterator } from "./is_built_in_async_iterator.js"

/**
 * isBuiltInIterator
 * @note
 *     you probably dont want to use this
 *     you probably want:
 *     - isSyncIterableObjectOrContainer()
 *     - isIterableObjectOrContainer()
 *     - isAsyncIterableObjectOrContainer()
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
export const isBuiltInIterator = (item)=>isBuiltInSyncIterator(item)||isBuiltInAsyncIterator(item)