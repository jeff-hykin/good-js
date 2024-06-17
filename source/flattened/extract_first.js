/**
 * extract a regex pattern and get the remaining data
 *
 * @example
 * ```js
 *     // basic example
 *     var remaining = "blah thing3: num8: 1"
 *     var { remaining, extraction: thing, } = extractFirst({ pattern: /thing\d: /, from: remaining })
 *     var { remaining, extraction: num,   } = extractFirst({ pattern: /num\d: /, from: remaining })
 *     // NOTE: the "blah" is still there. Use "^" e.g. /^thing/ to only extract from the front
 *     console.log(remaining === "blah 1") // true
 *     console.log(thing === "thing3: ") // true
 * 
 *     // full example
 *     var remaining = "blah thing3: num8: 1"
 *     var { preText, match, extraction, postText, remaining } = extractFirst({ pattern: /thing(\d): /, from: remaining })
 *     // preText == "blah "
 *     // match == [ index: 5, "thing5: ", "5" ] // usual regex match object
 *     // extraction == "thing5: "
 *     // postText == "num8: 1"
 *     // remaining == "blah num8: 1"
 * ```
 *     
 * @param {RegExp} arg1.pattern - note: using the global flag 
 * @param {String} arg1.from
 * @param arg1.from - a regex pattern
 * @returns {String|null} output.remaining - part of the string not matched
 * @returns {String|null} output.remaining - part of the string not matched
 *
 */
export function extractFirst({ pattern, from }) {
    // remove the global flag, because it makes .index not work
    pattern = !pattern.global ? pattern : new RegExp(pattern, pattern.flags.replace("g",""))
    const match = from.match(pattern)
    return {
        get preText() {
            return !match ? "" : from.slice(0, match.index)
        },
        match,
        extraction: match && match[0],
        get postText() {
            return !match ? from : from.slice(match.index + match[0].length)
        },
        get remaining() {
            return !match ? from : from.slice(0, match.index)+ from.slice(match.index + match[0].length)
        },
    }
}