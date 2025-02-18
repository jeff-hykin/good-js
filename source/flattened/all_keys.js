// import { allKeys } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.3.0/source/flattened/all_keys.js"

/**
 * Far Beyond Object.keys()
 *
 * @param {any} - any value at all
 * @return {String[]} all methods, getters, and keys
 *
 * @example
 * ```js
 *     allKeys(5) // yes numbers have keys
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
 * ```
 */
export const allKeys = function(obj) {
    // from: https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object/70629468?noredirect=1#comment126513832_70629468
    const listOfKeys = []
    // super-primitives have no attributes
    if (obj == null) {
        return []
    }
    // normal primitives still have listOfKeys, just skip the first iteration
    if (!(obj instanceof Object)) {
        obj = Object.getPrototypeOf(obj)
    }
    while (obj) {
        listOfKeys.push(Reflect.ownKeys(obj))
        obj = Object.getPrototypeOf(obj)
    }
    return [...new Set(listOfKeys.flat(1))]
}