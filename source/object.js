module.exports = {
    /**
     * Safely get nested values
     *
     * @param {any} obj.from - what object/value you're extracting from
     * @param {string[]} obj.keyList - anObject.key1.key2 -> [ "key1", "key2" ]
     * @param {any} obj.failValue - what to return in the event of an error
     * @return {any} either the failValue or the actual value
     *
     * @example
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
     */
    get({ from, keyList, failValue }) {
        // iterate over nested values
        try {
            for (var each of keyList) {
                if (from instanceof Object && each in from) {
                    from = from[each]
                } else {
                    return failValue
                }
            }
        } catch (error) {
            return failValue
        }
        return from
    },
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
     *     let obj = { key1: {} }
     *     // equivlent to obj.key1.subKey.subSubKey
     *     set({
     *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
     *         to: 10,
     *         on: obj,
     *     })
     *     set({
     *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
     *         to: 10,
     *         on: obj,
     *     })
     */
    set({ keyList, on, to }) {
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
            on[lastAttribute] = value
        } catch (error) {
            throw new Error(`\nthe set function was unable to set the value for some reason\n    the set obj was: ${JSON.stringify(on)}\n    the keyList was: ${JSON.stringify(keyList)}\n    the value was: ${JSON.stringify(to)}\nthe original error message was:\n\n`, error)
        }
        return on
    },
    /**
     * Safely delete nested values
     *
     * @param {any} obj.from - what object/value you're extracting from
     * @param {string[]} obj.keyList - anObject.key1.key2 -> [ "key1", "key2" ]
     * @return {undefined}
     *
     * @example
     *     let obj = { key1: {} }
     *     // equivlent to obj.key1.subKey.subSubKey
     *     delete({
     *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
     *         from: obj,
     *     })
     */
    delete({ keyList, from }) {
        if (keyList.length == 1) {
            try {
                delete from[keyList[0]]
            } catch (error) {
                return false
            }
        } else if (keyList.length > 1) {
            keyList = [...keyList]
            let last = keyList.pop()
            let parentObj = module.exports.get({ keyList, from })
            return module.exports.delete({ keyList: [last], from: parentObj })
        }
    },
    merge({ oldData, newData }) {
        // if its not an object, then it immediately overwrites the value
        if (!(newData instanceof Object) || !(oldData instanceof Object)) {
            return newData
        }
        // default value for all keys is the original object
        let output = {}
        newData instanceof Array && (output = [])
        Object.assign(output, oldData)
        for (const key in newData) {
            // if no conflict, then assign as normal
            if (!(key in output)) {
                output[key] = newData[key]
                // if there is a conflict, then be recursive
            } else {
                output[key] = module.exports.merge(oldData[key], newData[key])
            }
        }
        return output
    },
    /**
     * Function to sort alphabetically an array of objects by some specific key.
     *
     * @param {string[]} obj.keyList list of keys of which property to sort by
     * @param {string[]} [obj.largestFirst=false] decending order
     * @example
     * let listOfObjects = [ { a:1 }, { a:3 }, { a:2 }, ]
     * listOfObjects.sort(
     *     compareProperty({keyList:['a']})
     * )
     * //  [ { a: 1 }, { a: 2 }, { a: 3 } ]
     *
     * listOfObjects.sort(
     *   compareProperty({
     *     keyList:['a'],
     *     largestFirst:true
     *   })
     * )
     * //  [ { a: 3 }, { a: 2 }, { a: 1 } ]
     */
    compareProperty({ keyList, largestFirst = false }) {
        let comparison = (a, b) => {
            let aValue = module.exports.get({ keyList, from: a, failValue: -Infinity })
            let bValue = module.exports.get({ keyList, from: b, failValue: -Infinity })
            if (typeof aValue == "number") {
                return aValue - bValue
            } else {
                return aValue.localeCompare(bValue)
            }
        }
        if (largestFirst) {
            oldComparison = comparison
            comparison = (b, a) => oldComparison(a, b)
        }
        return comparison
    },
    /**
     * Deep iterate objects
     *
     * @param {Object} obj - Any object
     * @return {string[][]} lists of key-lists
     *
     * @example
     *
     *     recursivelyAllAttributesOf({ a: { b: 1} })
     *     >>> [
     *         [ 'a', ],
     *         [ 'a', 'b' ],
     *     ]
     */
    recursivelyAllAttributesOf(obj) {
        // if not an object then add no attributes
        if (!(obj instanceof Object)) {
            return []
        }
        // else check all keys for sub-attributes
        let output = []
        for (let eachKey of Object.keys(obj)) {
            // add the key itself (alone)
            output.push([eachKey])
            // add all of its children
            let newAttributes = module.exports.recursivelyAllAttributesOf(obj[eachKey])
            // if nested
            for (let eachNewAttributeList of newAttributes) {
                // add the parent key
                eachNewAttributeList.unshift(eachKey)
                output.push(eachNewAttributeList)
            }
        }
        return output
    },
}
