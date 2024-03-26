import { removeCommonSuffix } from "./remove_common_suffix.js"

/**
 * Removes the common suffix from a list of strings.
 *
 * @param {string[]} listOfStrings - An array of strings from which to remove the common suffix.
 * @returns {string[]} - An array of strings with the common suffix removed.
 *
 * @example
 *     ```js
 *     const input = ["abcdef", "aaadef", "cccmdef"]
 *     var output = removeCommonSuffix(input)
 *     // output is ["abc", "aaa", "cccm"]
 * 
 *     const input2 = ["abcdef"]
 *     output = removeCommonSuffix(input2)
 *     // output is ["abcdef"]
 *     // (wont reduce to empty string if only one element in the list)
 * 
 *     const input3 = ["abc", "abc", "abc"]
 *     output = removeCommonSuffix(input3)
 *     // output is ["", "", ""]
 *     ```
 */
export function withoutCommonSuffix(listOfStrings) {
    const copy = [...listOfStrings]
    removeCommonSuffix(copy)
    return copy
}