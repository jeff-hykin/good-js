import { removeCommonSuffix } from "./remove_common_suffix.js"

/**
 * Removes the common suffix from a list of strings.
 *
 * @param {string[]} listOfStrings - An array of strings from which to remove the common suffix.
 * @returns {undefined} - The input array is mutated.
 *
 * @example
 *     ```js
 *     const input = ["abcdef", "aaadef", "cccmdef"]
 *     console.log(removeCommonSuffix(input)) // ["abc", "aaa", "cccm"]
 *     // input is unmodified
 *
 *     const input2 = ["abcdef"]
 *     console.log(removeCommonSuffix(input2)) // ["abcdef"]
 *     // (wont reduce to empty string if only one element in the list)
 * 
 *     const input3 = ["abc", "abc", "abc"]
 *     console.log(removeCommonSuffix(input3)) // ["", "", ""]
 *     ```
 */
export function commonSuffixRemoved(listOfStrings) {
    listOfStrings = [...listOfStrings]
    removeCommonSuffix(listOfStrings)
    return listOfStrings
}