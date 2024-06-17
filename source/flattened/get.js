import { allKeys } from "./all_keys.js"

/**
 * Safely get nested values
 *
 * @param {any} obj.from - what object/value you're extracting from
 * @param {string[]} obj.keyList - anObject.key1.key2 -> [ "key1", "key2" ]
 * @param {any} obj.failValue - what to return in the event of an error
 * @return {any} either the failValue or the actual value
 *
 * @example
 *     ```js
 *     let obj = { key1: {} }
 *     // equivlent to obj.key1.subKey.subSubKey
 *     get({
 *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
 *         from: obj,
 *     })
 *     get({
 *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
 *         from: null,
 *     })
 *     get({
 *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
 *         from: null,
 *         failValue: 0
 *     })
 *     ```
 */
export const get = ({ keyList, from, failValue }) => {
    const lastKey = keyList.slice(-1)[0]
    for (const each of keyList.slice(0,-1)) {
        // couldn't make it to the last key
        if (from == null) {
            return failValue
        } else {
            // try is required because of getter functions that can throw errors
            try {
                from = from[each]
            } catch (error) {
                return failValue
            }
        }
    }
    if (from == null) {
        return failValue
    }
    let lastValue
    try {
        lastValue = from[lastKey]
        if (lastValue !== undefined) {
            return lastValue
        }
    } catch (error) {
        return failValue
    }
    const isAKey = allKeys(from).includes(lastKey)
    if (isAKey) {
        return lastValue
    } else {
        return failValue
    }
}