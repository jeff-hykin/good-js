function replaceVerticalWhitespace(char) {
    return char == "\n" ? "\\n" : "\\r"
}
/**
 * Escapes a string as a single-quoted javascript string
 *
 * @example
 * ```js
 * console.log(escapeStringAsJsSingleQuotes("hello world"))
 * // 'hello world'
 * console.log(escapeStringAsJsSingleQuotes("hello\nworld"))
 * // 'hello\nworld'
 * for (let each of ["hello\nworld", "hello\r\nworld", "hello\\'nworld", "hello\'world", "hello\\'\'\0world\v", `✅`, `❌`, `😀`, `😀\n😀❔☣︎🥗💿\n\t`]) {
 *     console.log(eval(escapeStringAsJsSingleQuotes(each))==each)
 * }
 * ```
 * @param {string} string - the string to escape
 * @returns {string} - a single-quoted javascript string
 */
export function escapeStringAsJsSingleQuotes(string) {
    return `'${string.replace(/'|\\/g, "\\$&").replace(/\n|\r/g, replaceVerticalWhitespace)}'`
}