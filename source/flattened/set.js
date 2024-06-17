// TODO: clean up using JSON.stringify in the error since it could throw another error

/**
 * Forcefully set nested values
 *
 * @param {string[]} obj.keyList - anObject.key1.key2 -> [ "key1", "key2" ]
 * @param {any} obj.to - what the new value should be
 * @param {any} obj.on - what object/value you're modifying
 * @return {Object} - the object given (object is still mutated)
 * @error
 * only if the argument is not an object
 *
 * @example
 *     ```js
 *     let obj = { key1: {} }
 *     // equivlent to obj.key1.subKey.subSubKey
 *     set({
 *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
 *         to: 10,
 *         on: obj,
 *     })
 *     ```
 */
export const set = ({ keyList, to, on, }) => {
    let originalKeyList = keyList
    try {
        keyList = [...keyList]
        let lastAttribute = keyList.pop()
        for (var key of keyList) {
            // create each parent if it doesnt exist
            if (!(on[key] instanceof Object)) {
                on[key] = {}
            }
            // change the object reference be the nested element
            on = on[key]
        }
        on[lastAttribute] = to
    } catch (error) {
        throw new Error(`\nthe set function was unable to set the value for some reason\n    the set obj was: ${JSON.stringify(on)}\n    the keyList was: ${JSON.stringify(originalKeyList)}\n    the value was: ${JSON.stringify(to)}\nthe original error message was:\n\n`, error)
    }
    return on
}