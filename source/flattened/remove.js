import { get } from "./get.js"

/**
 * Safely remove nested values
 *
 * @param {any} obj.from - what object/value you're extracting from
 * @param {string[]} obj.keyList - anObject.key1.key2 -> [ "key1", "key2" ]
 * @return {undefined}
 *
 * @example
 *     ```js
 *     let obj = { key1: {} }
 *     // equivlent to obj.key1.subKey.subSubKey
 *     remove({
 *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
 *         from: obj,
 *     })
 *     ```
 */
export const remove = ({ keyList, from }) => {
    if (keyList.length == 1) {
        try {
            delete from[keyList[0]]
        } catch (error) {
            return false
        }
    } else if (keyList.length > 1) {
        keyList = [...keyList]
        let last = keyList.pop()
        let parentObj = get({ keyList, from })
        return remove({ keyList: [last], from: parentObj })
    }
}