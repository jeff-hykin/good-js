// Summary of all javascript (ECMA Script) types
    // 2022 ECMA Script reference: https://262.ecma-international.org/13.0/#sec-ecmascript-data-types-and-values
    // super primitives: (no attributes whatsoever)
        // undefined
        // null
    // primitives: (not instances of Object, but have attributes)
        // Boolean
        // Symbol
            // special value: Symbol.hasInstance
            // special value: Symbol.isConcatSpreadable
            // special value: Symbol.iterator
            // special value: Symbol.asyncIterator
            // special value: Symbol.match
            // special value: Symbol.matchAll
            // special value: Symbol.replace
            // special value: Symbol.search
            // special value: Symbol.species
            // special value: Symbol.split
            // special value: Symbol.toPrimitive
            // special value: Symbol.toStringTag
            // special value: Symbol.unscopables
        // Number
            // special value: Infinity
            // special value: -Infinity
            // special value: NaN
        // BigInt
        // String
    // base containers:
        // Object
        // Array
    // singulars: (e.g. non-containers, but are instanceof Object)
        // RegExp
        // Date
        // URL
        // in the future `Temporal` may be added here (as a fix for Date)
    // support: (used for internals, not really values directly)
        // Error
            // AggregateError
            // EvalError
            // RangeError
            // ReferenceError
            // SyntaxError
            // TypeError
            // URIError
        // Function
        // Promise
        // AsyncFunction, Note: not globally defined
        // GeneratorFunction, Note: not globally defined
        // AsyncGeneratorFunction, Note: not globally defined
        // SyncGenerator, Note: not offically named or globally defined
        // AsyncGenerator, Note: not offically named or globally defined
    // extra containers:
        // Set
        // Map
        // WeakSet
        // WeakMap
        // URLSearchParams
    // iterators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator
        // IteratorPrototype, Note: not globally defined, https://262.ecma-international.org/7.0/#sec-%iteratorprototype%-object
        // SetIterator, Note: not globally defined
        // MapIterator, Note: not globally defined
        // TODO: the regex matchall iterator
    // typed arrays:
        // Int8Array
        // Int16Array
        // Int32Array
        // Uint8Array
        // Uint16Array
        // Uint32Array
        // Uint8ClampedArray
        // Float32Array
        // Float64Array
        // BigInt64Array
        // BigUint64Array
    // advanced (non-iterable):
        // ArrayBuffer
        // SharedArrayBuffer
        // DataView
        // WeakRef
        // FinalizationRegistry
    // weird not-types-but-kinda-feel-like-types
        // while AsyncFunction is type, generally any normal function that returns a promise is considered an async function (and they do not have that type)
        // arrow functions are not 
        // sync iteratables: any object with a valid [Symbol.iterator] method
        // async iterables: any object with a valid [Symbol.asyncIterator] method 
        // iterator: any object with a valid next() function, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
    
    // not ECMA Script but supported on at least Deno, NodeJS, and Firefox 
        // Request
        // Response
        // TextDecoder
        // TextEncoder
        // TextDecoderStream
        // TextEncoderStream
    
    // not ECMA Scipt
        // Worker
        // File
        // Blob
        // SubtleCrypto
        // Crypto
        // CryptoKey
        // PromiseRejectionEvent

    // Classes I havent verified yet
        //
        //         AbortController
        //         AbortSignal
        //
        //     NodeJS/Deno/Browser but probably not ECMA Script
        //
        //         Event
        //         EventTarget
        //
        //         Performance
        //         PerformanceEntry
        //         PerformanceMark
        //         PerformanceMeasure
        //
        //
        //
        //         ReadableByteStreamController
        //         ReadableStream
        //         ReadableStreamBYOBReader
        //         ReadableStreamBYOBRequest
        //         ReadableStreamDefaultController
        //         ReadableStreamDefaultReader
        //
        //         WritableStream
        //         WritableStreamDefaultController
        //         WritableStreamDefaultWriter
        //
        //         TransformStream
        //         TransformStreamDefaultController
        //         CompressionStream
        //         DecompressionStream
        //
        //         MessageChannel
        //         MessageEvent
        //         MessagePort
        //
        //         ByteLengthQueuingStrategy
        //         CountQueuingStrategy
        //
        //         DOMException
        //
        //         FormData
        //         Headers
        //
        //     Common but not on NodeJS
        //
        //         File
        //         FileReader
        //
        //         WebSocket
        //
        //         ProgressEvent
        //         CustomEvent
        //         CloseEvent
        //         ErrorEvent
        //
        //         Location
        //
        //         URLPattern
        //
        //         Navigator
        //
        //         SubtleCrypto
        //
        //     Uncommon
        //
        //         Cache
        //         CacheStorage
        //         Storage
        //         Window


// 
// nail down built-in classes
// 

    export const typedArrayClasses = [
        Uint16Array,
        Uint32Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Int32Array,
        Int8Array,
        Float32Array,
        Float64Array,
        globalThis.BigInt64Array,
        globalThis.BigUint64Array,
    ].filter(each=>each)
    export const copyableClasses = new Set([ RegExp, Date, URL, ...typedArrayClasses, globalThis.ArrayBuffer, globalThis.DataView, ])

    export const IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))
    export const ArrayIterator = Object.getPrototypeOf([][Symbol.iterator])
    export const MapIterator = Object.getPrototypeOf((new Map())[Symbol.iterator])
    export const SetIterator = Object.getPrototypeOf((new Set())[Symbol.iterator])
    export let AsyncFunction = class {}
    export let GeneratorFunction = class {}
    export let AsyncGeneratorFunction = class {}
    export let SyncGenerator = class {}
    export let AsyncGenerator = class {}
    try {
        AsyncFunction = eval("(async function(){}).constructor")
        GeneratorFunction = eval("(function*(){}).constructor")
        AsyncGeneratorFunction = eval("(async function*(){}).constructor")
        // this is in a try-catch so that it plays nice with babel transpiling
        SyncGenerator = eval("((function*(){})()).constructor")
        AsyncGenerator = eval("((async function*(){})()).constructor")
    } catch (error) {}

// 
// checker functions
// 
    /**
     * isPrimitive
     *
     * @param value - any value
     * @example
     *     // true
     *     isPrimitive(BigInt("1"))
     *     isPrimitive("1")        
     *     isPrimitive(null)
     *     isPrimitive(NaN)
     *     isPrimitive(Symbol("hi"))
     *     
     *     // false
     *     isPrimitive(new RegExp())
     *     isPrimitive(new Date())
     *     isPrimitive({})
     */
    export const isPrimitive = (value)=>!(value instanceof Object)

    /**
     * isPureObject
     *
     * @param value - any value
     * @example
     *     // false
     *     isPureObject(new RegExp())
     *     isPureObject([])
     *     class A {}
     *     isPureObject(new A)
     *     
     *     // true
     *     isPureObject({})
     */
    export const isPureObject = (value)=>(value instanceof Object)&&Object.getPrototypeOf(value).constructor == Object
    

    /**
     * isPracticallyPrimitive
     *
     * @param value - any value
     * @example
     *     // false
     *     isPracticallyPrimitive({})
     *     isPracticallyPrimitive([])
     *     class A {}
     *     isPracticallyPrimitive(new A)
     *     
     *     // true
     *     isPracticallyPrimitive(new Date())
     *     isPracticallyPrimitive(new RegExp())
     *     class D extends Date {}
     *     isPracticallyPrimitive(new D())
     */
    export const isPracticallyPrimitive = (value)=>isPrimitive(value) || value instanceof Date || value instanceof RegExp || value instanceof URL

    /**
     * isBuiltInIterator
     * @note
     *     it is excptionally rare that this should be used
     *     see isSyncIterableObjectOrContainer() for likely usecase
     * @param value - any value
     * @example
     *     // false
     *     isBuiltInIterator(new Map())
     *     isBuiltInIterator([])
     *     
     *     // true
     *     isBuiltInIterator((new Map())[Symbol.iterator]())
     *     isBuiltInIterator((new Set())[Symbol.iterator]())
     */
    export const isBuiltInIterator = (value)=>IteratorPrototype.isPrototypeOf(value)

    export const isGeneratorType = (value) => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
        if (value instanceof Object) {
            // all builtin interators are also generators
            if (isBuiltInIterator(value)) {
                return true
            }
            const constructor = value.constructor
            return constructor == SyncGenerator || constructor == AsyncGenerator
        }
        return false
    }

    export const isAsyncIterable = function(value) {
        return value && typeof value[Symbol.asyncIterator] === 'function'
    }

    export const isSyncIterable = function(value) {
        return value && typeof value[Symbol.iterator] === 'function'
    }

    export const isIterableObjectOrContainer = function(value) {
        return value instanceof Object && (typeof value[Symbol.iterator] == 'function' || typeof value[Symbol.asyncIterator] === 'function')
    }
    
    export const isTechnicallyIterable = function(value) {
        return value instanceof Object || typeof value == 'string'
    }
    
    /**
     * isSyncIterableObjectOrContainer
     *
     * @param value - any value
     * @returns {Boolean} output - whether or not people would call this object an iterable
     *
     * @example
     *     // false
     *     isSyncIterableObjectOrContainer("adfsad")
     *     isSyncIterableObjectOrContainer({a:1})
     *     isSyncIterableObjectOrContainer(null)
     * 
     *     // true
     *     isSyncIterableObjectOrContainer([])
     *     isSyncIterableObjectOrContainer(new Set())
     *     isSyncIterableObjectOrContainer(new Map())
     *     class A { *[Symbol.iterator]() { yield* [1,2,3] } }
     *     isSyncIterableObjectOrContainer(new A())
     */
    export const isSyncIterableObjectOrContainer = function(value) {
        return value instanceof Object && typeof value[Symbol.iterator] == 'function'
    }

// 
// deep copy
// 
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
        } else if (copyableClasses.has(value.constructor)) {
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