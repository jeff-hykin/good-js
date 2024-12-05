import { convertNormalStringToBase64String } from '/Users/jeffhykin/repos/good-js/source/flattened/convert_normal_string_to_base64_string.js'

/**
 * @example
 * ```js
 * console.log(
 *     // output == `"data:text/javascript;base64,Y29uc29sZS5sb2coJ2hlbGxvIHdvcmxkJyk="`
 *     convertJsCodeToBase64ImportString("console.log('hello world')")
 * )
 * ```
 */
export function convertJsCodeToBase64ImportString(codeString) {
    return `"data:text/javascript;base64,${convertNormalStringToBase64String(codeString)}"`
}