/**
 * Binary search list of objects or numbers
 *
 * @example
 * ```js
 * 
 * var array = [10, 20, 30, 40]  // even length
 * var target = 25
 * var result = binarySearch({ find: target, in: array })
 * console.log(result)
 * 
 * var array = [1, 2, undefined, 4]
 * var target = 3
 * var result = binarySearch({ find: target, in: array })
 * console.log(result)
 * 
 * var array = [1]
 * var target = 2
 * var result = binarySearch({ find: target, in: array })
 * console.log(result)
 * 
 * var sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * var targetValue = 5.5
 * var [lowIndex, index, highIndex] = binarySearch({find: targetValue, in: sortedArray})
 * console.log(lowIndex)   // 4
 * console.log(highIndex)  // 5
 * console.log(index) // null
 * ```
 * 
 * ```js
 * var sortedArray = [ {v:1}, {v:2}, {v:3}, {v:4}, {v:5}, {v:6}, {v:7}, {v:8}, {v:9}, {v:10} ]
 * var targetValue = 5.5
 * var [lowIndex, index, highIndex] = binarySearch({
 *     find: targetValue,
 *     in: sortedArray,
 *     isSorted: true,
 *     toValue: each=>each.v,
 * })
 * console.log(lowIndex)   // 4
 * console.log(index) // null
 * console.log(highIndex)  // 5
 * ```
 * ```
 * @param {Object} params - The parameters for the binary search.
 * @param {*} params.find - The target element to find in the array.
 * @param {Array} params.in - The sorted array to search.
 * @param {Array} params.toValue - a function for transforming elements
 * @param {Array} params.isSorted - a function for transforming elements
 * @returns {[number, number|null, number]} A tuple with low index, found index (or null), and high index
 */
export function binarySearch(params) {
    let { in: list, find: targetValue, toValue, isSorted } = params
    if (!isSorted) {
        if (toValue) {
            list = [...list].sort((a,b)=>toValue(a)-toValue(b))
        } else {
            list = [...list].sort((a,b)=>a-b)
        }
    }
    let lowIndex = 0
    let highIndex = list.length - 1
    let midIndex
    if (!toValue) {
        while (lowIndex <= highIndex) {
            midIndex = Math.floor((lowIndex + highIndex) / 2)
            const midValue = list[midIndex]

            if (midValue === targetValue) {
                return [ midIndex-1, midIndex, midIndex+1 ] // Found the target, return its index
            } else if (midValue < targetValue) {
                lowIndex = midIndex + 1 // Target is in the right half
            } else {
                highIndex = midIndex - 1 // Target is in the left half
            }
        }
    } else {
        while (lowIndex <= highIndex) {
            midIndex = Math.floor((lowIndex + highIndex) / 2)
            const midValue = toValue(list[midIndex])

            if (midValue === targetValue) {
                return [ midIndex-1, midIndex, midIndex+1 ] // Found the target, return its index
            } else if (midValue < targetValue) {
                lowIndex = midIndex + 1 // Target is in the right half
            } else {
                highIndex = midIndex - 1 // Target is in the left half
            }
        }
    }

    // Target is not in the array
    // NOTE! lowIndex and highIndex are misnomers at this point!
    //       lowIndex > highIndex always
    return [ highIndex, null, lowIndex ]
}