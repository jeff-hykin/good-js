import { toRepresentation } from "./to_representation.js"

/**
 * More Reliable than .toString()
 *
 * @returns {String} 
 * @example
 * ```js
 *     import { toString } from "https://deno.land/x/good/flattened/to_string.js"
 * 
 *     `${Symbol("blah")}` // throws error
 *     (null).toString() // throws error
 * 
 *     toString(Symbol("blah")) // 'Symbol("blah")'
 *     toString(null)           // 'null'
 * ```
 */
export const toString = (value)=>{
    // no idea why `${Symbol("blah")}` throws an error (and is the only primitive that throws)
    if (typeof value == 'symbol') {
        return toRepresentation(value)
    // all other primitives
    } else if (!(value instanceof Object)) {
        return value != null ? value.toString() : `${value}`
    // instead of [Object object]
    } else {
        return toRepresentation(value)
    }
}