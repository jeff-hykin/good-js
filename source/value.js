export const primitiveArrayClasses = [Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, Int16Array, Int32Array, Int8Array, Float32Array, Float64Array, globalThis.BigInt64Array, globalThis.BigUint64Array].filter(each=>each)

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

export const ownKeyDescriptions = Object.getOwnPropertyDescriptors

export const allKeyDescriptions = function(value, options={includingBuiltin:false}) {
    var { includingBuiltin } = {...options}
    // from: https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object/70629468?noredirect=1#comment126513832_70629468
    let descriptions = []
    // super-primitives have no attributes
    if (value == null) {
        return {}
    }
    // normal primitives still have descriptions, just skip the first iteration
    if (!(value instanceof Object)) {
        value = Object.getPrototypeOf(value)
    }
    const rootPrototype = Object.getPrototypeOf({})
    let prevObj
    while (value && value != prevObj) {
        if (!includingBuiltin && value == rootPrototype) {
            break
        }
        descriptions = descriptions.concat(Object.entries(Object.getOwnPropertyDescriptors(value)))
        prevObj = value
        value = Object.getPrototypeOf(value)
    }
    descriptions.reverse()
    return Object.fromEntries(descriptions)
}

const MapIterator = Object.getPrototypeOf((new Map()).keys())
const SetIterator = Object.getPrototypeOf((new Set()).keys())
let GeneratorFunction = class {}
let AsyncGeneratorFunction = class {}
try {
    // this is in a try-catch so that it plays nice with babel transpiling
    GeneratorFunction = eval("((function*(){})()).constructor")
    AsyncGeneratorFunction = eval("((async function*(){})()).constructor")
} catch (error) {}
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
// the real deep copy (wrapped below to seal-up/hide the arguments that are only used for recursion)
function deepCopyInner(value, valueChain=[], originalToCopyMap=new Map()) {
    valueChain.push(value)

    // super-primitives
    if (value == null) {
        return value
    }
    // normal primitives
    if (! (value instanceof Object) ) {
        return value
    }
    
    // use the cache whenever possible
    if (originalToCopyMap.has(value)) {
        return originalToCopyMap.get(value)
    }

    // if theres a deepCopy method use that
    if (value[deepCopySymbol] instanceof Function) {
        const clonedValue = value[deepCopySymbol]()
        originalToCopyMap.set(value, clonedValue)
        return clonedValue
    }
    
    // cannot deep copy a generator
    if (isGeneratorType(value)) {
        throw Error(`Sadly built-in generators cannot be deep copied.\nAnd I found a generator along this path:\n${valueChain.reverse().map(each=>`${each},\n`)}`)
    }
    
    // 
    // things that can have properties
    // 
    let object, theThis, thisCopy

    // mutable primitives (essentially)
    if (value instanceof Date) {
        object = new Date(value.getTime())
    } else if (value instanceof RegExp) {
        object = new RegExp(value)
    // Functions
    } else if (value instanceof Function) {
        theThis = value[getThis]()
        object = function(...args) { return value.apply(thisCopy, args) }
    // Uint16Array, Float32Array, etc
    } else if (primitiveArrayClasses.includes(value.constructor)) {
        object = new value.constructor([...value])
    // array
    } else if (value instanceof Array) {
        object = []
    // set
    } else if (value instanceof Set) {
        object = new Set()
    // map
    } else if (value instanceof Map) {
        object = new Map()
    }
    
    // set the value before becoming recursive otherwise self-referencing objects will cause infinite recursion
    originalToCopyMap.set(value, object)
    
    // edgecase of recursion for Function
    if (object instanceof Function) {
        thisCopy = deepCopyInner(theThis, valueChain, originalToCopyMap)
    }

    // custom objects
    const output = object
    // prototype and constructor
    try {
        output.constructor = value.constructor // probably not perfect
    } catch (error) {}
    Object.setPrototypeOf(output, Object.getPrototypeOf(value))
    // property
    const propertyDefinitions = {}
    for (const [key, description] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
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
        // property or method (binding "this" will be done automatically if its a method)
        } else {
            // another painful edgecase (array length pretends to be a value instead of a setter/getter even though it behaves as a setter/getter)
            // (I'm pretty confident this is the only edgecase, but its possible there's a few more edgecases like this that I've missed)
            if (key == "length" && output instanceof Array) {
                continue
            }
            propertyDefinitions[key] = {
                ...options,
                value: deepCopyInner(value, valueChain, originalToCopyMap),
            }
        }
    }
    Object.defineProperties(output, propertyDefinitions)
    return output
}
export const deepCopy = (value)=>deepCopyInner(value) // hides/disables the additional arguments that deepCopyInner utilizes


export const shallowSortObject = (obj) => {
    return Object.keys(obj).sort().reduce(
        (newObj, key) => { 
            newObj[key] = obj[key]; 
            return newObj
        }, 
        {}
    )
}

export const deepSortObject = (obj, seen=new Map()) => {
    if (!(obj instanceof Object)) {
        return obj
    } else if (seen.has(obj)) {
        // return the being-sorted object
        return seen.get(obj)
    } else {
        if (obj instanceof Array) {
            const sortedChildren = []
            seen.set(obj, sortedChildren)
            for (const each of obj) {
                sortedChildren.push(deepSortObject(each, seen))
            }
            return sortedChildren
        } else {
            const sorted = {}
            seen.set(obj, sorted)
            for (const eachKey of Object.keys(obj).sort()) {
                sorted[eachKey] = deepSortObject(obj[eachKey], seen)
            }
            return sorted
        }
    }
}

export const stableStringify = (value, ...args) => {
    return JSON.stringify(deepSortObject(value), ...args)
}