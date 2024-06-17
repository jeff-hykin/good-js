import { deepCopySymbol } from "./deep_copy_symbol.js"
import { isGeneratorType } from "./is_generator_type.js"
import { builtinCopyablePrimitiveClasses } from "./builtin_copyable_primitive_classes.js"

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
        const clonedValue = value[deepCopySymbol](originalToCopyMap)
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
    } else if (value instanceof URL) {
        object = new URL(value)
    // Functions
    } else if (value instanceof Function) {
        theThis = value[getThis]()
        object = value.bind(theThis)
    // Uint16Array, Float32Array, etc
    } else if (builtinCopyablePrimitiveClasses.has(value.constructor)) {
        object = new value.constructor(value)
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
        // bind to copy of "this", not the real "this"
        object = object.bind(thisCopy)
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
        const { value, get, set, ...options } = description
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