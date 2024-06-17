/**
 * Deep iterate object children DFS-like
 *
 * @param {Object} obj - Any object
 * @return {string[][]} lists of key-lists
 *
 * @example
 *     ```js
 *     recursivelyOwnKeysOf({ a: { b: 1} })
 *     >>> [
 *         [ 'a', ],
 *         [ 'a', 'b' ],
 *     ]
 *     ```
 */
export function *recursivelyIterateOwnKeysOf(obj, recursionProtecion=new Set()) {
    // if not an object then add no attributes
    if (!(obj instanceof Object)) {
        return []
    }
    recursionProtecion.add(obj)
    // else check all keys for sub-attributes
    for (const eachKey of Object.keys(obj)) {
        // add the key itself (alone)
        yield [eachKey]
        let value
        // try-catch required for getters that throw errors
        try {
            value = obj[eachKey]
        } catch (error) {
            continue
        }
        if (recursionProtecion.has(value)) {
            continue
        }
        for (const eachNewAttributeList of recursivelyIterateOwnKeysOf(value, recursionProtecion)) {
            // add the parent key
            eachNewAttributeList.unshift(eachKey)
            yield eachNewAttributeList
        }
    }
}