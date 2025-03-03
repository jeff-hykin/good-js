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
 * // handles edgecases of code points vs unicode characters
 * console.log(
 *     escapeJsString(
 *         `olor: o },\n        u = null\n    return console.error(\"Error handled by React Router default ErrorBoundary:\", e), (u = x.createElement(x.Fragment, null, x.createElement(\"p\", null, \"💿 Hey developer 👋\"), x.createElement(\"p\", null, \"You can provide a way better UX than this when your app throws errors by providing your own \", \${test}`,
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
    let index = -1
    const chars = [...string]
    for (const each of chars) {
        index++
        let nextOutput
        if (customEscaper && typeof (nextOutput = customEscaper(each, index+1, string)) == "string") {
            chars[index] = nextOutput
            continue
        }
        if (each == "\\") {
            chars[index] = "\\\\"
        } else if (each == "`") {
            chars[index] = "\\`"
        } else if (each == "$") {
            if (chars[index+1] == "{") {
                chars[index] = "\\$"
            } else {
                chars[index] = "$"
            }
        } else if (each == "\r") { // special because it screws up CRLF vs LF and makes the file look like a binary file
            chars[index] = "\\r"
        // sequences that dont need to be escaped
        } else if (each == "\b"||each == "\t"||each == "\n"||each == "\v"||each=="\f") { // note: \r is the only one missing, which is intentional because it causes problems: https://262.ecma-international.org/13.0/#sec-ecmascript-data-types-and-values
            chars[index] = each
        } else if (each.codePointAt(0) < 0x7F) {
            chars[index] = each
        } else if (/\$|\p{ID_Continue}/u.test(each)) {
            chars[index] = each
        } else {
            const stringified = JSON.stringify(each)
            if (stringified.length > 4) { // unicode escape needed, "\\n".length == 4
                chars[index] = stringified.slice(1,-1) // slices off the double quote, and the first of two backslashes
            } else {
                chars[index] = each
            }
        }
    }
    return "`"+chars.join("")+"`"
}