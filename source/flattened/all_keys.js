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