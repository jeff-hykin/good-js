import { escapeRegexMatch } from "./escape_regex_match.js"
import { iterZipLongSync as zip } from "./iter_zip_long_sync.js"
import { toString } from "./to_string.js"

/**
 * lets you interpolate regex and strings into a single regex (escapes strings, preserves regexes)
 * 
 * @example
 * ```js
 * let pattern = regexJoin`a${/[thing]/}${"[thing]"}`
 * ```
 *
 * @param {string[]} strings - An array of strings to join.
 * @param {(string|RegExp)[]} values - An array of values to insert between the strings. Values can be either strings or regular expressions.
 * @returns {RegExp} - A regular expression created from the joined strings and values.
 */
function regexJoin(strings, values) {
    let newRegexString = ""
    for (const [ string, value ] of zip(strings,values)) {
        newRegexString += string
        if (value instanceof RegExp) {
            // NOTE: a side effect is that the flags will be stripped
            // the `(?: )` is a non-capture group to prevent alternation from becoming a problem
            // for example: `a|b` + `c|d` becoming `a|bc|d` (bad/incorrect) instead of becoming `(?:a|b)(?:c|d)` (correct)
            newRegexString += `(?:${value.source})`
        } else if (value != null) {
            newRegexString += escapeRegexMatch(toString(value))
        }
    }
    return new Regexp(newRegexString)
}