/**
 * Safely check direct nested keys
 *
 * @param {any} object - what object/value you're extracting from
 * @param {string[]} keyList - anObject.key1.key2 -> [ "key1", "key2" ]
 * @return {Boolean} 
 *
 * @example
 *     ```js
 *     let obj = { key1: { key2: "inner"} }
 *     
 *     // false
 *     hasDirectKeyList(obj, [ 'key1', 'constructor' ])
 * 
 *     // true
 *     hasDirectKeyList(obj, [ 'key1', 'key2' ])
 *
 *     // false
 *     hasDirectKeyList(obj, [ 'key1', 'blah' ])
 *     
 *     // true for dynamic keys
 *     const proxyObject = new Proxy({}, {
 *         get(original, key, ...args) {
 *             if (key == "bob") {
 *                 return "dynamically generated key"
 *             }
 *             return original[key]
 *         },
 *     })
 *     // true
 *     hasDirectKeyList(proxyObject, [ 'bob' ])
 *     ```
 */
export const hasDirectKeyList = (object, keyList) => {
    const lastKey = keyList.pop()
    for (const each of keyList) {
        // couldn't make it to the last key
        if (object == null) {
            return false
        } else {
            // try is required because of getter functions that can throw errors
            try {
                object = object[each]
            } catch (error) {
                return false
            }
        }
    }
    if (object == null) {
        return false
    }
    try {
        const lastValue = object[lastKey]
        if (lastValue !== undefined) {
            return true
        }
    } catch (error) {
        return false
    }
    // (5).blahBlahBlah returns undefined, even though blahBlahBlah isnt a key
    // so for the last one, we have to do a full check
    return Object.keys(object).includes(lastKey)
}