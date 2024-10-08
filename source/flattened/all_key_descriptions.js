/**
 * Retrieves a mapping of all key descriptions for the given object or value.
 *
 * @param {any} value - The object or value to retrieve key descriptions for.
 * @param {object} [options] - Optional configuration options.
 * @param {boolean} [options.includingBuiltin=false] - Whether to include built-in object properties.
 * @returns {object} - A mapping of all key descriptions for the given object or value.
 */
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