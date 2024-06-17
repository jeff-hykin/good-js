import { removeCommonPrefix } from "./remove_common_prefix.js"

/**
 * Removes the common prefix from a list of strings.
 *
 * @param {string[]} listOfStrings - An array of strings from which to remove the common prefix.
 * @returns {undefined} - The input array is mutated.
 *
 * @example
 *     ```js
 *     const input = ["abcdef", "abcxyz", "abcmnop"]
 *     console.log(commonPrefixRemoved(input)) // ["def", "xyz", "mnop"]
 *     // input is unmodified
 *
 *     // Test case:
 *     const input2 = ["abcdef",]
 *     console.log(commonPrefixRemoved(input2)) // ["abcdef"]
 * 
 *     const input3 = ["abc", "abc", "abc"]
 *     console.log(commonPrefixRemoved(input3)) // ["", "", ""]
 *     ```
 */
export function commonPrefixRemoved(listOfStrings) {
    listOfStrings = [...listOfStrings]
    removeCommonPrefix(listOfStrings)
    return listOfStrings
}