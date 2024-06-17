import { emptyIterator } from "./empty_iterator.js"

/**
 * ensure a value is iterable (e.g convert arg)
 * ```
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