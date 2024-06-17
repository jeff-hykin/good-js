import { commonPrefix } from "./common_prefix.js"

/**
 * Removes the common prefix from a list of strings.
 *
 * @param {string[]} listOfStrings - An array of strings from which to remove the common prefix.
 * @returns {undefined} - The input array is mutated.
 *
 * @example
 *     ```js
 *     const input = ["abcdef", "abcxyz", "abcmnop"]
 *     removeCommonPrefix(input)
 *     // input is ["def", "xyz", "mnop"]
 *
 *     // Test case:
 *     const input2 = ["abcdef",]
 *     removeCommonPrefix(input2)
 *     // input is ["abcdef"]
 *     // (wont reduce to empty string if only one element in the list)
 * 
 *     const input3 = ["abc", "abc", "abc"]
 *     removeCommonPrefix(input3)
 *     // input is ["", "", ""]
 *     ```
 */
export function removeCommonPrefix(listOfStrings) {
    if (listOfStrings.length < 2) {
        return
    }
    const sliceOff = commonPrefix(listOfStrings).length
    if (sliceOff != 0) {
        let index = 0
        for (const each of listOfStrings) {
            listOfStrings[index] = each.slice(sliceOff)
            index += 1
        }
    }
}