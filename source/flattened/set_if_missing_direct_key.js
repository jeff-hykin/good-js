// TODO: clean up using JSON.stringify in the error since it could throw another error

/**
 * Forcefully set nested values
 *
 * @param {string[]} obj.keyList - anObject.key1.key2 -> [ "key1", "key2" ]
 * @param {any} obj.to - what the new value should be
 * @param {any} obj.on - what object/value you're modifying
 * @return {any} - the existing value or the recently-set value
 * @error
 * only if the argument is not an object
 *
 * @example
 *     ```js
 *     let obj = { key1: {} }
 * 
 *     // equivlent to obj.key1.subKey.subSubKey
 *     setIfMissingDirectKey({
 *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
 *         to: 10,
 *         on: obj,
 *     })
 *     // obj.key1.subKey.subSubKey === 10  is true
 * 
 *     setIfMissingDirectKey({
 *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
 *         to: 999,
 *         on: obj,
 *     })
 *     // obj.key1.subKey.subSubKey === 10  is STILL true
 * 
 *     obj.key1.subKey.subSubKey.toString // func
 *     setIfMissingDirectKey({
 *         keyList: [ 'key1', 'subKey', 'subSubKey', 'toString' ],
 *         to: 999,
 *         on: obj,
 *     })
 *     // toString wasnt a DIRECT key, so it was assigned
 *     // obj.key1.subKey.subSubKey.toString === 999
 * 
 *     ```
 */
export const setIfMissingDirectKey = ({ keyList, to, on, }) => {
    let originalKeyList = keyList
    try {
        keyList = [...keyList]
        let lastAttribute = keyList.pop()
        let neededToCreateParent = false
        for (var key of keyList) {
            // create each parent if it doesnt exist
            neededToCreateParent = !(on[key] instanceof Object)
            if (neededToCreateParent) {
                on[key] = {}
            }
            // change the object reference be the nested element
            on = on[key]
        }
        if (neededToCreateParent || !Object.keys(on).includes(lastAttribute)) {
            on[lastAttribute] = to
        }
        return on[lastAttribute]
    } catch (error) {
        throw new Error(`\nthe set function was unable to set the value for some reason\n    the set obj was: ${JSON.stringify(on)}\n    the keyList was: ${JSON.stringify(originalKeyList)}\n    the value was: ${JSON.stringify(to)}\nthe original error message was:\n\n`, error)
    }
}