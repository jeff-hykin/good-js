import { isValidIdentifier } from './is_valid_identifier.js'

/**
 * Backtick-escapes a string
 *
 * @example
 * ```js
 * console.log(escapeJsString("hello world"))
 * // `hello world`
 * console.log(escapeJsString("hello\nworld"))
 * // `hello
 * // world`
 * console.log(
 *     escapeJsString(
 *         "hello\nworld",
 *         // custom char escaper (make newlines into \n instead of being actual newlines)
 *         (char, index, string)=>(
 *             char == "\n" ? "\\n" : undefined
 *         )
 *     )
 * )
 * // `hello\nworld`
 * ```
 * @note this implementation is focused on correctness, and minimizing output size, not performance
 * @param {string} value - the javascript string to escape
 * @param {Function} [customEscaper] - a function that takes a character, index, and string, and returns a string to replace the character with
 * @returns {string} - a backtick string representing a minimal javascript string
 */
export const escapeJsString = (string, customEscaper) => {
    let newString = "`"
    let nextIndex = 0
    for (const each of string) {
        nextIndex++
        let nextOutput
        if (customEscaper && typeof (nextOutput = customEscaper(each, nextIndex, string)) == "string") {
            newString += nextOutput
            continue
        } 
        if (each == "\\") {
            newString += "\\\\"
        } else if (each == "`") {
            newString += "\\`"
        } else if (each == "$") {
            if (string[nextIndex] == "{") {
                newString += "\\$"
            } else {
                newString += "$"
            }
        } else if (each == "\r") { // special because it screws up CRLF vs LF and makes the file look like a binary file
            newString += "\\r"
        // sequences that dont need to be escaped
        } else if (each == "\b"||each == "\t"||each == "\n"||each == "\v"||each=="\f") { // note: \r is the only one missing, which is intentional because it causes problems: https://262.ecma-international.org/13.0/#sec-ecmascript-data-types-and-values
            newString += each
        } else if (each.codePointAt(0) < 0x7F) {
            newString += each
        } else if (isValidIdentifier(`_${each}`)) {
            newString += each
        } else {
            const stringified = JSON.stringify(each)
            if (stringified.length > 4) { // unicode escape needed, "\\n".length == 4
                newString += stringified.slice(1,-1) // slices off the double quote, and the first of two backslashes
            } else {
                newString += each
            }
        }
    }
    return newString +"`"
}