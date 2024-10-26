import { indent as indentFunc } from "./indent.js"
import { TypedArray } from "./typed_array__class.js"
import { typedArrayClasses } from "./typed_array_classes.js"
import { allKeys } from "./all_keys.js"

const reprSymbol = Symbol.for("representation")
const denoInspectSymbol = Symbol.for("Deno.customInspect")

const RegExpPrototype  = RegExp.prototype
const BigIntPrototype  = BigInt.prototype
const DatePrototype    = Date.prototype
const ArrayPrototype   = Array.prototype
const SetPrototype     = Set.prototype
const MapPrototype     = Map.prototype
const ObjectPrototype  = Object.prototype
const ErrorPrototype   = Error.prototype
const PromisePrototype = Promise.prototype

// NOTE: this can't be reliable. It is always possible to overwrite the constructor property of a prototype
// const getExtendedClassOfObject = (item)=>{
//     if (item == null || (typeof item != 'object' && typeof item != 'function')) {
//         return null
//     }
//     return Object.getPrototypeOf(Object.getPrototypeOf(item)).constructor
// }
const isProbablyAPrototype = (item)=>typeof item?.constructor == 'function' && item.constructor?.prototype == item

// TODO: iterables
// TODO: ArrayBuffer
// TODO: DataView
// TODO: Blob
// TODO: WeakRef
// TODO: TypedArray (the class)

let globalValues
/**
 * python's repr() for JS
 *
 */
export const toRepresentation = (item, {alreadySeen=new Map(), debug=false, simplified=false, indent="    "}={})=>{
    if (Number.isFinite(indent)) {
        indent = " ".repeat(indent)
    }
    const options = {alreadySeen, debug, simplified, indent}
    
    const recursionWrapper = (item, options)=>{
        // null is fast/special case
        if (item === undefined) {
            return "undefined"
        } else if (item === null) {
            return "null"
        }
        
        // lazy init to avoid slowdown on import
        globalValues = globalValues || new Map(
            allKeys(globalThis).map(each=>[globalThis[each], each])
        )
        const {alreadySeen, debug, simplified, indent} = options
        
        // prevent infinite recursion
        if (item instanceof Object) {
            if (alreadySeen.has(item)) {
                const output = alreadySeen.get(item)
                if (output != null) {
                    return output
                } else {
                    return `${String(item)} /*Self Reference*/`
                }
            } else {
                alreadySeen.set(item, null)
            }
        }

        const prototype = Object.getPrototypeOf(item)
        
        // 
        // custom representations
        // 
        
            // if custom object has a repr, use it
            if (typeof item[reprSymbol] == 'function') {
                try {
                    const output = item[reprSymbol](options) 
                    alreadySeen.set(item, output)
                    return output
                } catch (error) {
                    if (debug) {
                        console.error(`calling Symbol.for("representation") method failed (skipping)\nError was: ${error?.stack||error}`)
                    }
                }
            }

            // fallback on inspect methods 
            if (typeof item[denoInspectSymbol] == 'function') {
                try {
                    const output = item[denoInspectSymbol](options)
                    alreadySeen.set(item, output)
                    return output
                } catch (error) {
                    if (debug) {
                        console.error(`calling Symbol.for("Deno.customInspect") method failed (skipping)\nError was: ${error?.stack||error}`)
                    }
                }
            }
        
        let output
        if (debug) {
            console.group()
        }
        if (typeof item == 'number' || typeof item == 'boolean' || prototype == RegExpPrototype) {
            output = String(item)
        } else if (typeof item == 'string') {
            output = JSON.stringify(item)
        } else if (typeof item == 'symbol') {
            if (!item.description) {
                output = "Symbol()"
            } else {
                const description = item.description
                let globalVersion = Symbol.for(description)
                if (globalVersion == item) {
                    output = `Symbol.for(${JSON.stringify(description)})`
                } else if (description.startsWith("Symbol.") && (globalVersion = Symbol[description.slice(7)])) {
                    output = description
                } else {
                    output = `Symbol(${JSON.stringify(description)})`
                }
            }
        } else if (prototype == BigIntPrototype) {
            output = `BigInt(${item.toString()})`
        } else if (prototype == DatePrototype) {
            output = `new Date(${item.getTime()})`
            // vanilla errors
        // pure array
        } else if (prototype == ArrayPrototype) {
            output = arrayLikeRepr(item, options)
        } else if (prototype == SetPrototype) {
            output = `new Set([${arrayLikeRepr(item, options)}])`
        // map
        } else if (prototype == MapPrototype) {
            output = `new Map(${mapLikeObject(item.entries(), options)})`
        } else if (prototype == PromisePrototype) {
            output = `Promise.resolve(/*unknown*/)`
        } else if (globalValues.has(item)) {
            const key = globalValues.get(item)
            // this is overly restrictive but it works for now
            if (key.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) {
                output = key
            } else {
                output = `globalThis[${JSON.stringify(key)}]`
            }
        // probably a prototype
        } else if (isProbablyAPrototype(item) && item?.constructor?.name && typeof item?.constructor?.name == 'string') {
            const name = item.constructor.name
            if (simplified) {
                output = `${name}.prototype`
            } else {
                const isGlobalPrototype = eval(`globalThis[${JSON.stringify(name)}]?.prototype`) == item
                if (isGlobalPrototype) {
                    output = `${name}.prototype`
                } else {
                    output = customObjectRepr(item, options)
                }
            }
        // vanilla errors 
        } else if (prototype == ErrorPrototype && item?.constructor != globalThis.DOMException) {
            try {
                output = `new Error(${JSON.stringify(item?.message)})`
            } catch (error) {
                // yes this actually happens
                output = `new Error(${JSON.stringify(item)})`
            }
        // classes and functions
        } else if (typeof item == 'function') {
            let isNativeCode
            let asString
            let isClass
            const getAsString = ()=>{
                if (asString != null) {
                    return asString
                }
                try {
                    asString = item.toString()
                } catch (error) {
                    
                }
                return asString
            }
            const getIsNativeCode = ()=>{
                if (isNativeCode != null) {
                    return isNativeCode
                }
                try {
                    isNativeCode = getAsString().endsWith("{ [native code] }")
                } catch (error) {
                    
                }
                return isNativeCode
            }
            const getIsClass = ()=>{
                if (isClass != null) {
                    return isClass
                }
                try {
                    isClass = item.name && getAsString().match(/^class\b/)
                } catch (error) {
                    
                }
                return isClass
            }
            
            // named classes/functions
            const name = item.name
            if (name && typeof name == 'string') {
                // native
                if (getIsNativeCode()) {
                    output = `${name} /*native function*/`
                } else if (getIsClass()) {
                    if (simplified) {
                        output = `${name} /*class*/`
                    } else {
                        output = `class ${name} { /*...*/ }`
                    }
                } else {
                    if (simplified) {
                        output = `${item.name} /*function*/`
                    } else {
                        output = `(${getAsString()})`
                    }
                }
            // anonymous
            } else {
                output = `(${getAsString()})`
            }
        // 
        // non-function and (probably) non-prototype custom object
        // 
        } else {
            output = customObjectRepr(item, options)
        }
        
        alreadySeen.set(item, output)
        if (debug) {
            console.groupEnd()
        }
        return output
    }
    const pureObjectRepr = (item)=>{
        let string = "{"
        let propertyDescriptors
        try {
            propertyDescriptors = Object.entries(Object.getOwnPropertyDescriptors(item))
        } catch (error) {
            if (debug) {
                console.error(`[toRepresentation] error getting Object.propertyDescriptor\n${error?.stack||error}`)
            }
            try {
                return String(item)
            } catch (error) {
                return "undefined /*error: catestrophic representation failure*/"
            }
        }
        for (const [ key, { value, writable, enumerable, configurable, get, set } ] of propertyDescriptors) {
            let stringKey = recursionWrapper(key, options)
            if (typeof key == 'symbol') {
                stringKey = `[${stringKey}]`
            }
            if (get) {
                string += `\n${indent}get ${stringKey}(){/*contents*/}`
            } else {
                string += `\n${indent}${stringKey}: ${indentFunc({string:recursionWrapper(value, options), by:options.indent, noLead:true})},`
            }
        }
        if (propertyDescriptors.length == 0) {
            string += "}"
        } else {
            string += "\n}"
        }
        return string
    }
    const arrayLikeRepr = (item, options)=>{
        const chunks = []
        let oneHasNewLine = false
        for (const each of item) {
            const repr = recursionWrapper(each, options)
            chunks.push(repr)
            if (!oneHasNewLine && repr.includes("\n")) {
                oneHasNewLine = true
            }
        }
        if (!oneHasNewLine) {
            return `[${chunks.join(",")}]`
        } else {
            return `[\n${chunks.map(each=>indentFunc({string:each, by:options.indent, noLead:false})).join(",\n")}\n]`
        }
    }
    const mapLikeObject = (entries, options)=>{
        let string = ""
        for (const [key, value] of entries) {
            const stringKey = recursionWrapper(key, {...options, simplified:true})
            const stringValue = recursionWrapper(value, options)
            if (!stringKey.includes("\n")) {
                const formattedValue = (
                    (stringValue.includes("\n")) ?
                        indentFunc({string:stringValue, by:options.indent, noLead:true})
                        :
                        indentFunc({string:stringValue, by:options.indent, noLead:true})
                ) 
                string += `\n${options.indent}[${stringKey}, ${formattedValue}],`
            // multiline key
            } else {
                const doubleIndent = options.indent+options.indent
                string += `\n${options.indent}[\n${indentFunc({string:stringKey, by:doubleIndent, noLead:false})},\n${indentFunc({string:stringValue, by:doubleIndent, noLead:false})}\n${options.indent}],`
            }
        }
        if (entries.length != 0) {
            return string+"\n"
        }
        return string
    }
    const customObjectRepr = (item, options)=>{
        const prototype = Object.getPrototypeOf(item)
        // pure object
        if (prototype == ObjectPrototype) {
            return pureObjectRepr(item)
        }
        let className = prototype.constructor?.name
        let output
        if (typeof className != 'string' || className == "Object" || className == "Function") {
            className = null
        }
        const vanillaCustomObjRepr = ()=>{
            if (className) {
                if (options.simplified) {
                    return `new ${className}(/*...*/)`
                } else {
                    return `new ${className}(${pureObjectRepr(item)})`
                }
            } else {
                return pureObjectRepr(item)
            }
        }
        // exteneded builtins
        if (item instanceof Array || item instanceof TypedArray || item instanceof Set) {
            let isAllIndexKeys 
            try {
                isAllIndexKeys = Object.keys(item).every(each=>Number.isInteger(each-0)&&each>=0)
            } catch (error) {
                if (debug) {
                    console.error(`[toRepresentation] error checking isAllIndexKeys\n${error?.stack||error}`)
                }
            }
            
            let arrayLikeReprString
            if (isAllIndexKeys) {
                try {
                     arrayLikeReprString = arrayLikeRepr(item, options)
                } catch (error) {
                    isAllIndexKeys = false
                }
            }

            if (isAllIndexKeys) {
                if (className) {
                    output = `new ${className}(${arrayLikeReprString})`
                } else {
                    if (item instanceof Array){
                        output = arrayLikeReprString
                    } else if (item instanceof TypedArray) {
                        for (const each of typedArrayClasses) {
                            if (item instanceof each) {
                                output = `new ${each.name}(${arrayLikeReprString})`
                                break
                            }
                        }
                    } else if (item instanceof Set) {
                        output = `new Set(${arrayLikeReprString})`
                    }
                }
            } else {
                output = vanillaCustomObjRepr(item)
            }
        } else if (item instanceof Map) {
            if (className && options.simplified) {
                output = `new ${className}(/*...*/)`
            } else {
                let entries = []
                try {
                    entries = Map.prototype.entries.call(item)
                } catch (error) {
                    if (debug) {
                        console.error(`[toRepresentation] error getting Map.prototype.entries\n${error?.stack||error}`)
                    }
                }
                const core = mapLikeObject(entries, options)
                if (className) {
                    output = `new ${className}(${core})`
                } else {
                    output = `new Map(${core})`
                }
            }
        } else {
            try {
                output = vanillaCustomObjRepr(item)
            } catch (error) {
                try {
                    output = pureObjectRepr(item)
                } catch (error) {
                    try {
                        output = item.toString()
                    } catch (error) {
                        return "undefined /*error: catestrophic representation failure*/"
                    }
                }
            }
        }
        
        return output
    }
    
    try {
        const output = recursionWrapper(item, options)
        return output
    } catch (error) {
        if (debug) {
            console.debug(`[toRepresentation] error is:`,error)
        }
        return String(item)
    }
}
// toRepresentation(new Map([["a", "b"]]))