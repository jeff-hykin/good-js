import { emptyGeneratorObject } from "./empty_generator_object.js"

/**
 * coerces a value into an iterator
 *
 * @note
 *     is length-preserving
 */
export const makeIterator = (value)=>{
    if (typeof value?.next == 'function') {
        return value
    } else if (value == null) {
        return emptyGeneratorObject
    } else if (typeof value[Symbol.iterator] == 'function') {
        const iterator = value[Symbol.iterator]()
        if (!Number.isFinite(iterator?.length)) {
            if (Number.isFinite(value?.length)) {
                iterator.length = value.length
            } else if (Number.isFinite(value?.size)) {
                iterator.length = value.size
            }
        }
        return iterator
    } else if (typeof value[Symbol.asyncIterator] == 'function') {
        const iterator = value[Symbol.asyncIterator]()
        if (!Number.isFinite(iterator?.length)) {
            if (Number.isFinite(value?.length)) {
                iterator.length = value.length
            } else if (Number.isFinite(value?.size)) {
                iterator.length = value.size
            }
        }
        return iterator
    } else if (typeof value == 'function') {
        // assume its a generator function, return a generator object
        return value()
    } else if (Object.getPrototypeOf(value).constructor == Object) {
        const entries = Object.entries(value)
        const output = entries[Symbol.iterator]()
        output.length = entries.length
        return output
    }
    return emptyGeneratorObject
}