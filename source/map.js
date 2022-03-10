
/**
 * hash
 *
 * @param value - anything that can be stringified
 * @return {Number} a hash number
 *
 * @example
 *     does something
 */
export const hashJsonPrimitive = (value) => JSON.stringify(value).split("").reduce(
    (hashCode, currentVal) => (hashCode = currentVal.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode),
    0
)

export class DefaultMap extends Map {
    constructor(defaultFunction) {
        super()
        this.default = defaultFunction
    }
    weaklySet(key, value) {
        if (!super.has(key)) {
            super.set(key, value)
            return value
        } else {
            return super.get(key)
        }
    }
    get(key) {
        if (!super.has(key)) {
            if (this.default instanceof Function) {
                super.set(key, this.default(key))
            }
        }
        return super.get(key)
    }
}

const classesWithoutGlobalNames = {
    MapIterator: Object.getPrototypeOf((new Map()).keys()),
    SetIterator: Object.getPrototypeOf((new Set()).keys()),
    GeneratorFunction: ((function*(){})()).constructor,
    AsyncGeneratorFunction: ((async function*(){})()).constructor,
}
const primitiveArrayClasses = Object.freeze([Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, Int16Array, Int32Array, Int8Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array])
const recursivelyDefaultFunction = ()=>new DefaultMap(recursivelyDefaultFunction)
const keyifyStore = {
    primitiveLookup: new Map(),  // all keys are primitives, all values are Symbols
    objectLookup: new DefaultMap(recursivelyDefaultFunction), // classes are keys
    namedSymbols: {
        undefined: Symbol.for("undefined"),
        null: Symbol.for("null"),
        NaN: Symbol.for("NaN"),
        Infinity: Symbol.for("Infinity"),
        NegativeInfinity: Symbol.for("-Infinity"),
        true: Symbol.for("true"),
        false: Symbol.for("false"),
    },
}
const isDirectlyComparable = (item) => (
    !(item instanceof Object)   // if primitive
    || item instanceof Function // if unique (includes classes)
    || item instanceof Promise  // another class where are values are treated unique
    || item.constrctor == classesWithoutGlobalNames.GeneratorFunction
    || item.constrctor == classesWithoutGlobalNames.AsyncGeneratorFunction
)
const technicallyIsContainer = (item) => item instanceof Object
const isIntendedSelfReferenceableContainer = (item) => (
    item instanceof Object
    && !(item instanceof Date)
    && !(item instanceof RegExp)
    && !(item instanceof Function)
    && !(item instanceof Promise)
    && !(item instanceof classesWithoutGlobalNames.Generator)
    && !(item instanceof classesWithoutGlobalNames.AsyncGenerator)
    && !(item instanceof Error)
    && primitiveArrayClasses.includes(item)
)
const numberToSelfReferenceSymbol = new DefaultMap(()=>Symbol())
const numberToArrayIndexSymbol = new DefaultMap(()=>Symbol())
const theEmptyList = Object.freeze([])
const theEmptyObject = Object.freeze({})

export const keyValueify = (item, itemToSelfReferenceSymbol=(new Map())) => {
    if (itemToSelfReferenceSymbol.has(item)) {
        return [itemToSelfReferenceSymbol.get(item), item]
    }
    if (isDirectlyComparable(item)) {
        // if it hasn't been keyified yet, create a key for it
        if (!keyifyStore.primitiveLookup.has(item)) {
            keyifyStore.primitiveLookup.set(item, Symbol(`${item}`))
        }
        const symbolForPrimitive = keyifyStore.primitiveLookup.get(item)
        // get the key, and for these, the value 
        return [symbolForPrimitive, item]
    // 
    // if truely an object
    // 
    } else {
        const classOfObject = Object.getPrototypeOf(item)
        // get the map corrisponding to the class
        const classSpecificHashToKeyValue = keyifyStore.objectLookup.get(classOfObject)
        
        // RegExp and Date are basically treated like primitives
        if (item instanceof RegExp || item instanceof Date) {
            // if an equivlent object already existed, this will return [key, thatValue] instead of [key, item]
            return classSpecificHashToKeyValue.weaklySet(`${item}`, [ Symbol(), item ])
        // All forms of errors
        } else if (item instanceof Error) {
            // same if they have the same class and callstack
            // if an equivlent object already existed, this will return [key, thatValue] instead of [key, item]
            return classSpecificHashToKeyValue.weaklySet(`${item.stack}`, [ Symbol(), item ])
        // Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, Int16Array, Int32Array, Int8Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array
        } else if (primitiveArrayClasses.includes(classOfObject)) {
            // this could be a really long string which is why were only saving the hash # and not the string itself
            const hash = hashJsonPrimitive(`${item}`)
            // if an equivlent object already existed, this will return [key, thatValue] instead of [key, item]
            return classSpecificHashToKeyValue.weaklySet(hash, [ Symbol(), item ])
        // Array (the main challenge)
        } else if (item.constructor === Array) {

            // basecase, length 0
            if (item.length == 0) {
                return [ Symbol.for("[]"), theEmptyList ]
            }

            //
            // handling of self-referencing objects
            //
            // add self first
            if (!itemToSelfReferenceSymbol.has(item)) {
                // given object, returns unique symbol for that object
                // numberToSelfReferenceSymbol.get(1) === numberToSelfReferenceSymbol.get(1) // always
                // numberToSelfReferenceSymbol.get(1) !== literallyAnythingElse              // always
                itemToSelfReferenceSymbol.set(item, numberToSelfReferenceSymbol.get(itemToSelfReferenceSymbol.length))
            }
            // add children
            // NOTE: if we treat sets as being unordered, then solving self-reference devolves into the full solve-graph-isomormism problem
            // thankfully javascript's Set's confusingly have ordered elements (by specification)
            // so all refs will be found in the same order every time (if they're an equivlent object)
            // now we merely need to have numbered references instead of full guess-and-check isomorphism
            const thingsWeNeedToRemeber = item.filter(isIntendedSelfReferenceableContainer)
            for (const each of thingsWeNeedToRemeber) {
                // if any of the values could be self-referencing, go ahead and give them a number
                if (!itemToSelfReferenceSymbol.has(each)) {
                    // numberToSelfReferenceSymbol.get(1) === numberToSelfReferenceSymbol.get(1)  // always
                    // numberToSelfReferenceSymbol.get(1) !== literallyAnythingElse               // always
                    itemToSelfReferenceSymbol.set(each, numberToSelfReferenceSymbol.get(itemToSelfReferenceSymbol.length))
                }
            }
            // 
            // now recursion
            // 
            // volia, we have something manageable
            const flatListOfSymbols = item.map(each=>keyValueify(each)[0])
            
            // 
            // nested lookup
            // 
            
            // start based on the length
            if (!classSpecificHashToKeyValue.has(flatListOfSymbols.length)) {
                classSpecificHashToKeyValue.set(flatListOfSymbols.length, {})
            }
            let table = classSpecificHashToKeyValue.get(flatListOfSymbols.length)

            const symbols = [...flatListOfSymbols]
            while (symbols.length) {
                const endElement = symbols.pop()
                if (symbols.length == 0) {
                    // if we've never seen this array before, then create a symbol for it
                    if (!(endElement in table)) {
                        table[endElement] = Symbol()
                    }
                    const keyAsHash = table[endElement]
                    return classSpecificHashToKeyValue.weaklySet(keyAsHash, [ Symbol(), item ])
                }
                // drill down into a value-specific table until we hit the last element
                if (!(endElement in table)) {
                    table[endElement] = {}
                }
                table = table[endElement]
            }
        // Array-like things
        } else if (
            item instanceof Set
            || classOfObject == classesWithoutGlobalNames.MapIterator
            || classOfObject == classesWithoutGlobalNames.SetIterator
        ) {
            const asArray = [...item]
            const [ keyIfWasArray, _ ] = keyValueify(asArray, itemToSelfReferenceSymbol)
            return classSpecificHashToKeyValue.weaklySet(keyIfWasArray, [ Symbol(), item ])
        // Map
        } else if (item instanceof Map) {
            const asArray = item.entries().flat(1)
            const [ keyIfWasArray, _ ] = keyValueify(asArray, itemToSelfReferenceSymbol)
            return classSpecificHashToKeyValue.weaklySet(keyIfWasArray, [ Symbol(), item ])
        // generic Object or custom class
        } else {
            const asArray = Object.entries(item).flat(1)
            const [ keyIfWasArray, _ ] = keyValueify(asArray, itemToSelfReferenceSymbol)
            return classSpecificHashToKeyValue.weaklySet(keyIfWasArray, [ Symbol(), item ])
        }
        // TODO: handle the following somehow
            // ArrayBuffer
            // SharedArrayBuffer
            // DataView
            // FinalizationRegistry
            // WeakMap
            // WeakRef
            // WeakSet

    }
}

export const keyify = (value) => keyValueify(key)[0]
export const valueify = (value) => keyValueify(key)[1]