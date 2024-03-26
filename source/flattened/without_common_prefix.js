import { removeCommonPrefix } from "./remove_common_prefix.js"

/**
 * Removes the common prefix from a list of strings.
 *
 * @param {string[]} listOfStrings - An array of strings from which to remove the common prefix.
 * @returns {string[]} - An array of strings with the common prefix removed.
 *
 * @example
 *     ```js
 *     const input = ["abcdef", "abcddd", "abcefg"]
 *     var output = removeCommonPrefix(input)
 *     // output is ["def", "ddd", "efg"]
 * 
 *     const input2 = ["abcdef"]
 *     output = removeCommonPrefix(input2)
 *     // output is ["abcdef"]
 *     // (wont reduce to empty string if only one element in the list)
 * 
 *     const input3 = ["abc", "abc", "abc"]
 *     output = removeCommonPrefix(input3)
 *     // output is ["", "", ""]
 *     ```
 */
export function withoutCommonPrefix(listOfStrings) {
    const copy = [...listOfStrings]
    removeCommonPrefix(copy)
    return copy
}