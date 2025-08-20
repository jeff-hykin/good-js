/**
 * Backtick-escapes a string
 *
 * @example
 * ```js
 * console.log([...escapeJsStringIter("hello world")].join(""))
 * // `hello world`
 * console.log([...escapeJsStringIter("hello\nworld")].join(""))
 * // `hello
 * // world`
 * // handles edgecases of code points vs unicode characters
 * console.log(
 *     [...escapeJsStringIter(
 *         `olor: o },\n        u = null\n    return console.error(\"Error handled by React Router default ErrorBoundary:\", e), (u = x.createElement(x.Fragment, null, x.createElement(\"p\", null, \"💿 Hey developer 👋\"), x.createElement(\"p\", null, \"You can provide a way better UX than this when your app throws errors by providing your own \", \${test}`,
 *     )].join("")
 * )
 * ```
 * @param {string} value - the javascript string to escape
 * @returns {string} - a backtick string representing a minimal javascript string
 */
export const escapeJsStringIter = function *(stringOrIterable){
    const iterableSource = typeof stringOrIterable == "string" ?  [...stringOrIterable] : stringOrIterable
    const iterator = iterableSource[Symbol.iterator]()
    
    yield "`"
    var each="", done=false, next="", nextIsDone=false
    var {value: next, done} = iterator.next()
    const atLeastOneChar = !done
    if (atLeastOneChar) while (!nextIsDone) {
        // 
        // increment
        // 
        each = next
        var { value: next, done: nextIsDone } = iterator.next()

        // 
        // parse "each"
        // 
        if (each == "\\") {
            yield "\\\\"
        } else if (each == "`") {
            yield "\\`"
        } else if (each == "$") {
            if (next == "{") {
                yield "\\$"
            } else {
                yield "$"
            }
        } else if (each == "\r") { // special because it screws up CRLF vs LF and makes the file look like a binary file
            yield "\\r"
        // sequences that don't need to be escaped
        } else if (each == "\b"||each == "\t"||each == "\n"||each == "\v"||each=="\f") { // note: \r is the only one missing, which is intentional because it causes problems: https://262.ecma-international.org/13.0/#sec-ecmascript-data-types-and-values
            yield each
        } else if (each.codePointAt(0) < 0x7F) {
            yield each
        } else if (/\p{ID_Continue}/u.test(each)) {
            yield each
        } else {
            const stringified = JSON.stringify(each)
            if (stringified.length > 4) { // unicode escape needed, "\\n".length == 4
                yield stringified.slice(1,-1) // slices off the double quote, and the first of two backslashes
            } else {
                yield each
            }
        }
    }
    yield "`"
}