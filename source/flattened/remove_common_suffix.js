import { commonSuffix } from "./common_suffix.js"

/**
 * Removes the common suffix from a list of strings.
 *
 * @param {string[]} listOfStrings - An array of strings from which to remove the common suffix.
 * @returns {undefined} - The input array is mutated.
 *
 * @example
 *     ```js
 *     const input = ["abcdef", "aaadef", "cccmdef"]
 *     removeCommonSuffix(input)
 *     // input is ["abc", "aaa", "cccm"]
 * 
 *     const input2 = ["abcdef"]
 *     removeCommonSuffix(input2)
 *     // input is ["abcdef"]
 *     // (wont reduce to empty string if only one element in the list)
 * 
 *     const input3 = ["abc", "abc", "abc"]
 *     removeCommonSuffix(input3)
 *     // input is ["", "", ""]
 *     ```
 */
export function removeCommonSuffix(listOfStrings) {
    if (listOfStrings.length < 2) {
        return
    }
    const sliceOff = commonSuffix(listOfStrings).length
    if (sliceOff != 0) {
        let index = 0
        for (const each of listOfStrings) {
            listOfStrings[index] = each.slice(0,-sliceOff)
            index += 1
        }
    }
}