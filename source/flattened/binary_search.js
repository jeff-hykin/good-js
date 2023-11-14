/**
 * Binary search list of objects or numbers
 *
 * @example
 * ```js
 * var sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * var targetValue = 5.5
 * var [low, index, high] = binarySearch({find: targetValue, in: sortedArray})
 * console.log(low)   // 4
 * console.log(high)  // 5
 * console.log(index) // null
 * ```
 * 
 * ```js
 * var sortedArray = [ {v:1}, {v:2}, {v:3}, {v:4}, {v:5}, {v:6}, {v:7}, {v:8}, {v:9}, {v:10} ]
 * var targetValue = 5.5
 * var [low, index, high] = binarySearch({
 *     find: targetValue,
 *     in: sortedArray,
 *     toValue: each=>each.v,
 * })
 * console.log(low)   // 4
 * console.log(index) // null
 * console.log(high)  // 5
 * ```
 * ```
 * @param {Object} params - The parameters for the binary search.
 * @param {*} params.find - The target element to find in the array.
 * @param {Array} params.in - The sorted array to search.
 * @param {Array} params.toValue - a function for transforming elements
 * @returns {number} - The index of the target element in the array, or -1 if not found.
 */
export function binarySearch(params) {
    const { in: list, find: target, toValue } = params
    let low = 0
    let high = list.length - 1
    let mid
    if (!toValue) {
        while (low <= high) {
            mid = Math.floor((low + high) / 2)
            const guess = list[mid]

            if (guess === target) {
                return [ mid-1, mid, mid+1 ] // Found the target, return its index
            } else if (guess < target) {
                low = mid + 1 // Target is in the right half
            } else {
                high = mid - 1 // Target is in the left half
            }
        }
    } else {
        while (low <= high) {
            mid = Math.floor((low + high) / 2)
            const guess = toValue(list[mid])

            if (guess === target) {
                return [ mid-1, mid, mid+1 ] // Found the target, return its index
            } else if (guess < target) {
                low = mid + 1 // Target is in the right half
            } else {
                high = mid - 1 // Target is in the left half
            }
        }
    }

    // Target is not in the array
    // NOTE! low and high are misnomers at this point!
    //       low > high always
    return [ high, null, low ]
}