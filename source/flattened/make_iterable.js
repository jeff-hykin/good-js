import { emptyGeneratorObject } from "./empty_generator_object.js"
import { isIterator } from "./is_iterator.js"
import { AsyncFunction } from "./async_function__class.js"
import { isBuiltInGeneratorFunction } from "./is_built_in_generator_function.js"

/**
 * ensure a value is iterable (e.g. coerce arg)
 * assumes functions are generator functions
 */
export const makeIterable = (value)=>{
    if (value == null) {
        return emptyGeneratorObject
    }

    // natually iterable (Array, Set, Map, string, Uint8Array, etc)
    if (typeof value[Symbol.iterator] == 'function' || typeof value[Symbol.asyncIterator] == 'function') {
        return value
    }
    
    // wrap iterators in an iterable
    if (typeof value?.next == 'function') {
        // normally we would check if its a built-in async generator object
        // however, all built-in async generator objects (and sync built-in generator objects) are iterable
        // so this must be a custom iterator
        const isDefinitelyAsyncIterator = value?.next instanceof AsyncFunction
        let output
        if (isDefinitelyAsyncIterator) {
            output = { [Symbol.asyncIterator]() { return value }, ...value }
        } else {
            // we can't reliable detect if its a sync iterator or not
            // if the next function ever returns a promise, then it is an async iterator
            // but we can't know that unless it happens. So we just pretend its both sync and async and let the caller decide
            output = { [Symbol.iterator]() { return value }, [Symbol.asyncIterator]() { return value }, ...value }
        }
        // bind any additional functions such as .return() or .throw()
        for (const [key, eachValue] of Object.entries(value)) {
            if (typeof eachValue == 'function') {
                output[key] = eachValue.bind(value)
            }
        }
        return output
    }
    
    // if function, we assume its a generator function, and call it to get a generator value (which is iterable)
    if (typeof value == 'function') {
        return value()
    }
    
    // if pure value, iterate over entries
    if (Object.getPrototypeOf(value).constructor == Object) {
        return Object.entries(value)
    }

    // everything else (Date, RegExp, Boolean) becomes empty iterator
    return emptyGeneratorObject
}