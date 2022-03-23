export const primitiveArrayClasses = [Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, Int16Array, Int32Array, Int8Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array]

/**
 * Far Beyond Object.keys()
 *
 * @param {any} - any value at all
 * @return {String[]} all methods, getters, and keys
 *
 * @example
 *     deepKeys(5) // yes numbers have keys
 *     // [
 *     //     "constructor",          "toExponential",
 *     //     "toFixed",              "toPrecision",
 *     //     "toString",             "valueOf",
 *     //     "toLocaleString",       "constructor",
 *     //     "__defineGetter__",     "__defineSetter__",
 *     //     "hasOwnProperty",       "__lookupGetter__",
 *     //     "__lookupSetter__",     "isPrototypeOf",
 *     //     "propertyIsEnumerable", "toString",
 *     //     "valueOf",              "toLocaleString"
 *     // ]
 */
export const allKeys = function(obj) {
    // from: https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object/70629468?noredirect=1#comment126513832_70629468
    let keys = []
    // super-primitives have no attributes
    if (obj == null) {
        return []
    }
    // normal primitives still have keys, just skip the first iteration
    if (!(obj instanceof Object)) {
        obj = Object.getPrototypeOf(obj)
    }
    while (obj) {
        keys = keys.concat(Reflect.ownKeys(obj))
        obj = Object.getPrototypeOf(obj)
    }
    return keys
}

export const ownKeyDescriptions = function(obj) {
    return Reflect.ownKeys(obj).map(eachKey=>[eachKey, Reflect.getOwnPropertyDescriptor(obj, eachKey)])
}

export const allKeyDescriptions = function(obj) {
    // from: https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object/70629468?noredirect=1#comment126513832_70629468
    let keys = []
    // super-primitives have no attributes
    if (obj == null) {
        return []
    }
    // normal primitives still have keys, just skip the first iteration
    if (!(obj instanceof Object)) {
        obj = Object.getPrototypeOf(obj)
    }
    while (obj) {
        keys = keys.concat(keyDescriptions(obj))
        obj = Object.getPrototypeOf(obj)
    }
    return keys
}

const MapIterator = Object.getPrototypeOf((new Map()).keys())
const SetIterator = Object.getPrototypeOf((new Set()).keys())
const GeneratorFunction = ((function*(){})()).constructor
const AsyncGeneratorFunction = ((async function*(){})()).constructor
export const isGeneratorType = (value) => {
    if (value instanceof Object) {
        // look weird and convoluted? welcome to the nonsensical edgecases of JavaScript
        const prototype = Object.getPrototypeOf(value)
        if (prototype == MapIterator || prototype == SetIterator) {
            return true
        }
        const constructor = value.constructor
        return constructor == GeneratorFunction || constructor == AsyncGeneratorFunction
    }
    return false
}


export const deepCopySymbol = Symbol.for("deepCopy")
const clonedFromSymbol = Symbol()
const getThis = Symbol()
Object.getPrototypeOf(function(){})[getThis] = function() { return this } // add a way to extract the "this" from functions
export const deepCopy = function(value) {
    // FIXME: breaks on objects that somehow contain themselves

    function deepCopyInner(value, valueChain=[]) {
        valueChain.push(value)
        // super-primitives
        if (value == null) {
            return value
        }
        // normal primitives
        if (! (value instanceof Object) ) {
            return value
        }
        // mutable primitives (essentially)
        if (value instanceof Date) {
            return new Date(value.getTime())
        } else if (value instanceof RegExp) {
            return new RegExp(value)
        }
        
        // if theres a deepCopy method use that
        if (value[deepCopySymbol] instanceof Function) {
            return value[deepCopySymbol]()
        }
        
        // cannot deep copy a generator
        if (isGeneratorType(value)) {
            throw Error(`Sadly built-in generators cannot be deep copied.\nAnd I found a generator along this path:\n${valueChain.reverse().map(each=>`${each},\n`)}`)
        }
        
        // Functions
        if (value instanceof Function) {
            const theThis = value[getThis]()
            const thisCopy = deepCopyInner(theThis, valueChain)
            return function(...args) { return value.apply(thisCopy, args) }
        }
        
        // Uint16Array, Float32Array, etc
        const constructor = value.constructor
        if (primitiveArrayClasses.includes(constructor)) {
            return new constructor([...value])
        }
        
        // array
        if (value instanceof Array) {
            return value.map(each=>deepCopyInner(each, valueChain))
        }

        // set
        if (value instanceof Set) {
            return new Set([...value].map(each=>deepCopyInner(each, valueChain)))
        }
        
        // map
        if (value instanceof Map) {
            return new Map(value.entries().map(each=>deepCopyInner(each, valueChain)))
        }

        // custom objects
        const output = {}
        // prototype and constructor
        output.constructor = value.constructor // probably not perfect
        Object.setPrototypeOf(output, Object.getPrototypeOf(value))
        // property
        const propertyDefinitions = {}
        for (const [key, description] of ownKeyDescriptions(value)) {
            const { value, get, set, ...options} = description
            const getIsFunc = get instanceof Function
            const setIsFunc = set instanceof Function
            // isGetterSetter
            if (getIsFunc || setIsFunc) {
                propertyDefinitions[key] = {
                    ...options,
                    get: get ? function(...args) { return get.apply(output, args) } : undefined,
                    set: set ? function(...args) { return set.apply(output, args) } : undefined,
                }
            // isMethod
            } else if (value instanceof Function) {
                propertyDefinitions[key] = {
                    ...options,
                    value: function(...args) { return value.apply(output, args) },
                }
            // just regular property
            } else {
                propertyDefinitions[key] = {
                    ...options,
                    value: deepCopyInner(value),
                }
            }
        }
        Object.defineProperties(output, propertyDefinitions)
        return output
    }
    return deepCopyInner(value)
}