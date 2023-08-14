import {
    allKeys as allKeys1,
    ownKeyDescriptions as ownKeyDescriptions1,
    allKeyDescriptions as allKeyDescriptions1
} from "./value.js"

// annoying naming workaround so these can be re-exported while staying tree-shakeable-friendly
export const allKeys=allKeys1
export const ownKeyDescriptions=ownKeyDescriptions1
export const allKeyDescriptions=allKeyDescriptions1

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
export const get = ({ from, keyList, failValue }) => {
    // iterate over nested values
    try {
        for (const each of keyList) {
            if (from != null && allKeys(from).includes(each)) {
                from = from[each]
            } else {
                return failValue
            }
        }
    } catch (error) {
        return failValue
    }
    return from
}

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
 *     set({
 *         keyList: [ 'key1', 'subKey', 'subSubKey' ],
 *         to: 10,
 *         on: obj,
 *     })
 *     ```
 */
export const set = ({ keyList, on, to }) => {
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

/**
 * Recursively merge objects
 *
 * @param {Object} arg1 - 
 * @param {Object} arg1.oldData - This will be used as a foundation
 * @param {Object} arg1.newData - This data will be prefered
 * @return {Object} a new object
 *
 * @example
 *     ```js
 *     const out = merge({
 *         oldData: {z:{a:1,b:1}     },
 *         newData: {z:{b:3,c:3}, f:1}
 *     })
 *     // >> { z:{a:1,b:3,c:3}, f:1 }
 *     ```
 */
export const merge = ({ oldData, newData }) => {
    // if its not an object, then it immediately overwrites the value
    if (!(newData instanceof Object) || !(oldData instanceof Object)) {
        return newData
    }
    // default value for all keys is the original object
    let output = {}
    if (newData instanceof Array ) {
        output = []
    }
    Object.assign(output, oldData)
    for (const key in newData) {
        // if no conflict, then assign as normal
        // TODO: make sure this doesn't need allKeys(output).includes(key)
        if (!(key in output)) {
            output[key] = newData[key]
            // if there is a conflict, then be recursive
        } else {
            output[key] = merge(oldData[key], newData[key])
        }
    }
    return output
}

/**
 * Function to sort alphabetically an array of objects by some specific key.
 *
 * @param {string[]} obj.keyList list of keys of which property to sort by
 * @param {Boolean} [obj.largestFirst=false] decending order
 * @example
 *    ```js
 *    let listOfObjects = [ { a:1 }, { a:3 }, { a:2 }, ]
 *    listOfObjects.sort(
 *        compareProperty({keyList:['a']})
 *    )
 *    //  [ { a: 1 }, { a: 2 }, { a: 3 } ]
 *    
 *    listOfObjects.sort(
 *      compareProperty({
 *        keyList:['a'],
 *        largestFirst:true
 *      })
 *    )
 *    //  [ { a: 3 }, { a: 2 }, { a: 1 } ]
 *    ```
 */
export const compareProperty = ({ keyList, largestFirst = false }) => {
    let comparison = (a, b) => {
        const aValue = get({ keyList, from: a, failValue: -Infinity })
        const bValue = get({ keyList, from: b, failValue: -Infinity })
        if (typeof aValue == "number") {
            return aValue - bValue
        } else {
            return aValue.localeCompare(bValue)
        }
    }
    if (largestFirst) {
        let oldComparison = comparison
        comparison = (b, a) => oldComparison(a, b)
    }
    return comparison
}

/**
 * Function to sort alphabetically an array of objects by some specific key.
 *
 * @param {Function} obj.elementToNumber list of keys of which property to sort by
 * @param {Boolean} [obj.largestFirst=false] decending order
 * @example
 *     ```js
 *     let listOfObjects = [ { a:1 }, { a:3 }, { a:2 }, ]
 *     listOfObjects.sort(
 *         compare({elementToNumber:each=>each.a })
 *     )
 *     //  [ { a: 1 }, { a: 2 }, { a: 3 } ]
 *    
 *     listOfObjects.sort(
 *       compare({
 *         elementToNumber:each=>each.a,
 *         largestFirst:true
 *       })
 *     )
 *     //  [ { a: 3 }, { a: 2 }, { a: 1 } ]
 *     ```
 */
export const compare = ({ elementToNumber, largestFirst = false }) => {
    let comparison = (a, b) => {
        const aValue = elementToNumber(a)
        const bValue = elementToNumber(b)
        if (typeof aValue == "number") {
            return aValue - bValue
        } else {
            return aValue.localeCompare(bValue)
        }
    }
    if (largestFirst) {
        let oldComparison = comparison
        comparison = (b, a) => oldComparison(a, b)
    }
    return comparison
}

/**
 * Deep iterate objects
 *
 * @param {Object} obj - Any object
 * @return {string[][]} lists of key-lists
 *
 * @example
 *     ```js
 *     recursivelyAllKeysOf({ a: { b: 1} })
 *     >>> [
 *         [ 'a', ],
 *         [ 'a', 'b' ],
 *     ]
 *     ```
 */
export const recursivelyAllKeysOf = (obj) => {
    // if not an object then add no attributes
    if (!(obj instanceof Object)) {
        return []
    }
    // else check all keys for sub-attributes
    const output = []
    for (let eachKey of Object.keys(obj)) {
        // add the key itself (alone)
        output.push([eachKey])
        // add all of its children
        let newAttributes = recursivelyAllKeysOf(obj[eachKey])
        // if nested
        for (let eachNewAttributeList of newAttributes) {
            // add the parent key
            eachNewAttributeList.unshift(eachKey)
            output.push(eachNewAttributeList)
        }
    }
    return output
}

/**
 * Function that does something
 *
 * @param {String[]} array - a list of strings
 * @param {String[]} defaultValue - the value in key-value
 * @return {Object} an object with all keys set
 *
 * @example
 *     ```js
 *     const keys = ["thing1", "thing2"]
 *     const obj = arrayOfKeysToObject(keys)
 *     // obj == { "thing1": undefined, "thing2": undefined }
 *     ```
 */
export const arrayOfKeysToObject = (array, defaultValue)=>array.reduce((acc,curr)=> (acc[curr]=defaultValue,acc),{})



// 
// 
// below code is modified from: https://www.npmjs.com/package/camelize
// 
// 
    // // TODO: verify this then clean it up and export part of it
    // function walkObject(obj) {
    //     if (!obj || typeof obj !== "object") return obj
    //     if (isDate(obj) || isRegex(obj)) return obj
    //     if (isArray(obj)) return map(obj, walkObject)
    //     return reduce(
    //         objectKeys(obj),
    //         function (acc, key) {
    //             const camel = toCamelCase(key)
    //             acc[camel] = walkObject(obj[key])
    //             return acc
    //         },
    //         {}
    //     )
    // }
    // const isArray =
    //     Array.isArray ||
    //     function (obj) {
    //         return Object.prototype.toString.call(obj) === "[object Array]"
    //     }
    // const isDate = function (obj) {
    //     return Object.prototype.toString.call(obj) === "[object Date]"
    // }
    // const isRegex = function (obj) {
    //     return Object.prototype.toString.call(obj) === "[object RegExp]"
    // }
    // const objectKeys =
    //     Object.keys ||
    //     function (obj) {
    //         const keys = []
    //         for (const key in obj) {
    //             if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key)
    //         }
    //         return keys
    //     }
    // function map(xs, f) {
    //     if (xs.map) return xs.map(f)
    //     const res = []
    //     for (let i = 0; i < xs.length; i++) {
    //         res.push(f(xs[i], i))
    //     }
    //     return res
    // }
    // function reduce(xs, f, acc) {
    //     if (xs.reduce) return xs.reduce(f, acc)
    //     for (let i = 0; i < xs.length; i++) {
    //         acc = f(acc, xs[i], i)
    //     }
    //     return acc
    // }