import { indent as indentFunc } from "./indent.js"
import { TypedArray } from "./typed_array__class.js"
import { typedArrayClasses } from "./typed_array_classes.js"
import { allKeys } from "./all_keys.js"
import { isValidIdentifier } from "./is_valid_identifier.js"
import { isValidKeyLiteral } from "./is_valid_key_literal.js"

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
const UrlPrototype     = globalThis.URL?.prototype

// NOTE: this can't be reliable. It is always possible to overwrite the constructor property of a prototype
// const getExtendedClassOfObject = (item)=>{
//     if (item == null || (typeof item != 'object' && typeof item != 'function')) {
//         return null
//     }
//     return Object.getPrototypeOf(Object.getPrototypeOf(item)).constructor
// }
const isProbablyAPrototype = (item)=>typeof item?.constructor == 'function' && item.constructor?.prototype == item && isValidIdentifier(item.constructor?.name)

// TODO: extra properties on functions
// TODO: iterables
// TODO: ArrayBuffer
// TODO: DataView
// TODO: Blob
// TODO: WeakRef
// TODO: TypedArray (the class)

const representSymbol = (item)=>{
    if (!item.description) {
        return "Symbol()"
    } else {
        const description = item.description
        let globalVersion = Symbol.for(description)
        if (globalVersion == item) {
            return `Symbol.for(${JSON.stringify(description)})`
        } else if (description.startsWith("Symbol.") && Symbol[description.slice(7)]) {
            return description
        } else {
            return `Symbol(${JSON.stringify(description)})`
        }
    }
}
const reprKey = (key)=>{
    if (typeof key == 'symbol') {
        return `[${representSymbol(key)}]`
    } else if (isValidKeyLiteral(key)) {
        return key
    } else {
        return JSON.stringify(key)
    }
}
const allGlobalKeysAtInit = Object.freeze(allKeys(globalThis))
/**
 * python's repr() for JS
 *
 */
export const toRepresentation = (item, {alreadySeen=new Map(), debug=false, simplified, indent="    ", globalValues}={})=>{
    if (Number.isFinite(indent) && indent >= 0) {
        indent = " ".repeat(Math.floor(indent))
    }
    const options = {alreadySeen, debug, simplified, indent}
    const recursionWrapper = (item, options)=>{
        let groupIsOn = false
        try {
            
            // null is fast/special case
            if (item === undefined) {
                return "undefined"
            } else if (item === null) {
                return "null"
            }
            
            const {alreadySeen, simplified, indent} = options
            
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
            
            if (debug) {
                console.group()
                groupIsOn = true
            }
            let output
            if (typeof item == 'number' || typeof item == 'boolean' || prototype == RegExpPrototype) {
                output = String(item)
            } else if (typeof item == 'string') {
                output = JSON.stringify(item)
            } else if (typeof item == 'symbol') {
                output = representSymbol(item)
            } else if (prototype == BigIntPrototype) {
                output = `BigInt(${item.toString()})`
            } else if (prototype == DatePrototype) {
                output = `new Date(${item.getTime()})`
            // pure array
            } else if (prototype == ArrayPrototype) {
                output = arrayLikeRepr(item, options)
                let nonIndexKeys 
                try {
                    nonIndexKeys = Object.keys(item).filter(each=>!(Number.isInteger(each-0)&&each>=0))
                } catch (error) {
                    if (debug) {
                        console.error(`[toRepresentation] error checking nonIndexKeys\n${error?.stack||error}`)
                    }
                }
                if (nonIndexKeys.length > 0) {
                    let extraKeys = {}
                    for (const each of nonIndexKeys) {
                        try {
                            extraKeys[each] = item[each]
                        } catch (error) {
                            
                        }
                    }
                    if (Object.keys(extraKeys).length > 0) {
                        output = `Object.assign(${output}, ${pureObjectRepr(extraKeys)})`
                    }
                }
            } else if (prototype == SetPrototype) {
                output = `new Set(${arrayLikeRepr(item, options)})`
            // map
            } else if (prototype == MapPrototype) {
                output = `new Map(${mapLikeObject(item.entries(), options)})`
            } else if (prototype == PromisePrototype) {
                output = `Promise.resolve(/*unknown*/)`
            } else if (prototype == UrlPrototype) {
                output = `new URL(${JSON.stringify(item?.href)})`
            } else if (isGlobalValue(item)) {
                const key = globalValueMap.get(item)
                // key will always end up being either a string or a symbol
                if (isValidIdentifier(key) || key == "eval") { // eval is a very weird edgecase; "var eval;" is a sytax error
                    output = key
                } else {
                    if (typeof key == 'symbol') {
                        output = `globalThis[${representSymbol(key)}]`
                    } else if (isValidKeyLiteral(key)) {
                        output = `globalThis.${key}`
                    } else {
                        output = `globalThis[${JSON.stringify(key)}]`
                    }
                }
            // probably a prototype
            } else if (isProbablyAPrototype(item)) {
                const name = item.constructor.name // this is guarenteed to be a valid identifier because of isProbablyAPrototype
                let isPrototypeOfGlobal
                try {
                    isPrototypeOfGlobal = globalThis[name]?.prototype == item
                } catch (error) {}

                if (isPrototypeOfGlobal) {
                    output = `${name}.prototype`
                } else {
                    if (simplified) {
                        output = `${name}.prototype /*${name} is local*/`
                    } else {
                        output = `/*prototype of ${name}*/ ${customObjectRepr(item, options)}`
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
                    // some possible outputs (comparision of weird/normal behavior):
                        // name=="howDee",     toString()=="function howDee() {}"                   // from: function howDee() {}
                        // name=="howDee",     toString()=="function() {}"                          // from: var howDee = function() {} // NOTE: behaves same for let/const and arrow functions
                        // name=="get howDee", toString()=='"get howDee" () {}'                     // from: ({ "get howDee"() {} })["get howDee"].toString()
                        // name=="get $`",     toString()=="function get $`() { [native code] }"    // from: Object.getOwnPropertyDescriptors(RegExp)["$`"].get.toString()
                        // name=="get howDee", toString()=="get howDee() {}"                        // from: Object.getOwnPropertyDescriptors({ get howDee() {} }).howDee.get.toString()
                        // name=="get ",       toString()=='get "" () {\n    return 10;\n  }'       // from: Object.getOwnPropertyDescriptors( { get ""() { return 10 } })[""].get.toString()
                        // name=="",           toString()=="[s = Symbol()] () {}"                   // from: ({ [s = Symbol()]() {} })[s].toString()
                        // name=="get",        toString()=="()=>1"                                  // from: var a;Object.defineProperty(a, "hi", { get:()=>1});Object.getOwnPropertyDescriptor(a,"hi").get.toString()
                        // name=="",           toString()=="()=>1"                                  // from: (()=>1).toString()
                    if (asString != null) {
                        return asString
                    }
                    try {
                        // ensures toString is not overridden
                        asString = Function.prototype.toString.call(item)
                    } catch (error) {
                        
                    }
                    return asString
                }
                const getIsNativeCode = ()=>{
                    if (isNativeCode != null) {
                        return isNativeCode
                    }
                    try {
                        isNativeCode = !!getAsString().match(/{\s*\[native code\]\s*}$/)
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
                if (isValidIdentifier(name)) {
                    // native
                    if (getIsNativeCode()) {
                        output = `${name} /*native function*/`
                    } else if (getIsClass()) {
                        if (simplified) {
                            output = `${name} /*class*/`
                        } else {
                            output = getAsString()
                        }
                    } else {
                        if (simplified) {
                            output = `${item.name} /*function*/`
                        } else {
                            output = `(${getAsString()})`
                        }
                    }
                // anonymous class
                } else if (getIsClass()) {
                    if (typeof name == 'string') {
                        output = `/*name: ${JSON.stringify(name)}*/ class { /*...*/ }`
                    } else if (simplified) {
                        output = `class { /*...*/ }`
                    } else {
                        output = getAsString()
                    }
                // getter/setter literals
                } else if (typeof name == 'string' && getAsString().match(/^(function )?(g|s)et\b/)) {
                    const realName = name.slice(4) // remove "get " 
                    if (name[0] == 'g') {
                        output = `Object.getOwnPropertyDescriptor({/*unknown obj*/},${JSON.stringify(realName)}).get`
                    } else {
                        output = `Object.getOwnPropertyDescriptor({/*unknown obj*/},${JSON.stringify(realName)}).set`
                    }
                } else if (name) {
                    if (simplified) {
                        if (getIsNativeCode()) {
                            if (name.startsWith("get ")) {
                                const realName = name.slice(4)
                                if (Object.getOwnPropertyDescriptor(globalThis, realName)?.get == item) {
                                    output = `Object.getOwnPropertyDescriptor(globalThis, ${JSON.stringify(realName)}).get /*native getter*/`
                                } else {
                                    output = `Object.getOwnPropertyDescriptor({/*unknown obj*/}, ${JSON.stringify(realName)}).get`
                                }
                            } else if (name.startsWith("set ")) {
                                const realName = name.slice(4)
                                if (Object.getOwnPropertyDescriptor(globalThis, realName)?.set == item) {
                                    output = `Object.getOwnPropertyDescriptor(globalThis, ${JSON.stringify(realName)}).set /*native setter*/`
                                } else {
                                    output = `Object.getOwnPropertyDescriptor({/*unknown obj*/}, ${JSON.stringify(realName)}).set`
                                }
                            } else {
                                output = `(function(){/*name: ${recursionWrapper(name, options)}, native function*/}})`
                            }
                        } else {
                            output = `(function(){/*name: ${recursionWrapper(name, options)}*/}})`
                        }
                    } else {
                        output = `/*name: ${recursionWrapper(name, options)}*/ (${getAsString()})`
                    }
                // anonymous
                } else {
                    if (simplified) {
                        if (getIsNativeCode()) {
                            output = `(function(){/*native function*/}})`
                        } else {
                            output = `(function(){/*...*/}})`
                        }
                    } else {
                        // ()'s because of stuff like "()=>0 + 1"  vs "(()=>0) + 1"
                        output = `(${getAsString()})`
                    }
                }
            // 
            // non-function and (probably) non-prototype custom object
            // 
            } else {
                output = customObjectRepr(item, options)
            }
            
            if (groupIsOn) {
                console.groupEnd()
            }
            alreadySeen.set(item, output)
            return output
        } catch (error) {
            if (groupIsOn) {
                console.groupEnd()
            }
            if (debug) {
                console.debug(`[toRepresentation] error is: ${error}`,error?.stack||error)
            }
            try {
                return String(item)
            } catch (error) {
                return "{} /*error: catestrophic representation failure*/"
            }
        }
    }
    let globalValueMap
    const isGlobalValue = (item)=>{
        // lazy init to avoid unnecessary slowdown
        // does create values each time toRepresentation is called to avoid weird behavior (if globals are being dynamically changed)
        if (globalValueMap == null) {
            globalValueMap = globalValueMap || new Map(allGlobalKeysAtInit.filter(each=>{
                try {
                    globalThis[each]
                } catch (error) {
                    // yes this actually happens (in the browser)
                    return false
                }
                return true
            }).map(each=>[globalThis[each], each]))
            for (const [key, value] of Object.entries(globalValues||{})) {
                globalValueMap.set(key, value)
            }
        }
        return globalValueMap.has(item)
    }
    const pureObjectRepr = (item)=>{
        if (options.simplified == null) {
            options.simplified = true
        }
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
            const stringKey = reprKey(key)
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
        if (options.simplified == null) {
            options.simplified = true
        }
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

            // if simplified=false, keep it false all the way down
            if (options.simplified == null) {
                options.simplified = true
            }
            const stringKey = recursionWrapper(key, options)
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
        if (string.length == 0) {
            return ""
        } else {
            return `[${string}\n]`
        }
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
    // this is a sanity check to make sure toRepresentation basically never throws
    // it should basically never hit the error case
    } catch (error) {
        if (debug) {
            console.debug(`[toRepresentation] error is:`,error)
        }
        try {
            return String(item)
        } catch (error) {
            // I don't think this ever happens, but for sanity/proviability
            return typeof item
        }
    }
}
// toRepresentation(new Map([["a", "b"]]))