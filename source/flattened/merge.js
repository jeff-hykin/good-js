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
        if (!(key in oldData)) {
            output[key] = newData[key]
            // if there is a conflict, then be recursive
        } else {
            output[key] = merge({oldData: oldData[key], newData: newData[key]})
        }
    }
    return output
}