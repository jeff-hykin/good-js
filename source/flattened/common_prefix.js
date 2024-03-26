import { allEqual } from "./all_equal.js"

/**
 * Finds the common prefix from a list of strings.
 *
 * @param {string[]} listOfStrings - An array of strings from which to remove the common prefix.
 * @returns {string[]} - An array of strings with the common prefix removed.
 *
 * @example
 *     ```js
 *     // Test case:
 *     const input = ["abcdef", "abcxyz", "abcmnop"]
 *     const result = commonPrefix(input)
 *     // result is "abc"
 *     ```
 */
export function commonPrefix(listOfStrings) {
    let high = Math.max(...listOfStrings.map((each) => each.length))
    if (high === 0 || listOfStrings.length == 0) {
        return ""
    }
    let low = 0
    let mid
    let lastValid = 0
    while (low <= high) {
        mid = Math.floor((low + high) / 2)
        let isValid = allEqual(listOfStrings.map((each) => each.slice(0,mid)))

        if (isValid) {
            lastValid = mid
            low = mid + 1 // Target is in the right half
        } else {
            high = mid - 1 // Target is in the left half
        }
    }

    return listOfStrings[0].slice(0,lastValid)
}