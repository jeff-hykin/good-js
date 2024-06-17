import { escapeRegexMatch } from "./escape_regex_match.js"
import { zip } from "./zip.js"
import { toString } from "./to_string.js"

// 
// regex`pattern${/stuff/}${`stuff`}`.i
// 
const regexpProxy = Symbol('regexpProxy')
const realExec = RegExp.prototype.exec
// patching is required but only effects things with this proxy
RegExp.prototype.exec = function (...args) {
    if (this[regexpProxy]) {
        return realExec.apply(this[regexpProxy], args)
    }
    return realExec.apply(this, args)
}
// these are helpers for the .i part, which requires a proxy object
// declaring it out here saves on memory so there aren't a million instances of expensive proxy objects
let proxyRegExp
const regexProxyOptions = Object.freeze({
    get(original, key) {
        // if its flags, return a copy with those flags set
        if (typeof key == 'string' && key.match(/^[igmusyv]+$/)) {
            return proxyRegExp(original, key)
        }
        if (key == regexpProxy) {
            return original
        }
        return original[key]
    },
    set(original, key, value) {
        original[key] = value
        return true
    },
})
proxyRegExp = (parent, flags)=> {
    const regex = new RegExp(parent, flags)
    const output = new Proxy(regex, regexProxyOptions)
    Object.setPrototypeOf(output, Object.getPrototypeOf(regex))
    return output
}
// this is a helper to make regex() and regex.stripFlags() have the same underlying functionality
function regexWithStripWarning(shouldStrip) {
    return (strings, ...values) => {
        let newRegexString = ""
        for (const [ string, value ] of zip(strings,values)) {
            newRegexString += string
            if (value instanceof RegExp) {
                // ignore value.global since its common and wouldn't really mean anything in this context
                if (!shouldStrip && (value.flags.replace(/g/,"").length > 0)) {
                    console.warn(`Warning: flags inside of regex:\n    The RegExp trigging this warning is: ${value}\n    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)\n    one of the \${} values (the one above) was a RegExp with a flag enabled\n    e.g. /stuff/i  <- i = ignoreCase flag enabled\n    When the /stuff/i gets interpolated, its going to loose its flags\n    (thats what I'm warning you about)\n    \n    To disable/ignore this warning do:\n        regex.stripFlags\`something\${/stuff/i}\`\n    If you want to add flags to the output of regex\`something\${stuff}\` do:\n        regex\`something\${stuff}\`.i   // ignoreCase\n        regex\`something\${stuff}\`.ig  // ignoreCase and global\n        regex\`something\${stuff}\`.gi  // functionally equivlent\n`)
                }
                // the `(?: )` is a non-capture group to prevent alternation from becoming a problem
                // for example: `a|b` + `c|d` becoming `a|bc|d` (bad/incorrect) instead of becoming `(?:a|b)(?:c|d)` (correct)
                newRegexString += `(?:${value.source})`
            } else if (value != null) {
                newRegexString += escapeRegexMatch(toString(value))
            }
        }
        // this exists to make regex``.i, regex``.gi, etc work
        return proxyRegExp(newRegexString,"")
    }
}

/**
 * interpolate strings/regex
 *
 * @example
 * ```js
 *     const someName = "nameWithWeirdSymbols\\d(1)$@[]"
 *     const versionPattern = /\d+\.\d+\.\d+/
 *     const combined = regex`blah "${someName}"@${versionPattern}`.i
 *     // the string is regex-escaped, but the regex is kept as-is:
 *     /blah "nameWithWeirdSymbols\\d\(1\)\$@\[\]"@(?:\d+\.\d+)/i
 * 
 *     // NOTE: interpolating with flags will give a warning that they will be stripped:
 *     const versionPattern2 = /\d+\.\d+\.\d+/iu
 *     regex`blah thing@${versionPattern2}` // >>> warning the "iu" flags will be stripped
 *     // use this to intentionally strip flags
 *     regex.stripFlags`blah thing@${versionPattern2}` // no warning
 * ```
 * @param arg1 - a template string
 * @returns {RegExp} output
 *
 */
export const regex = regexWithStripWarning(false)
regex.stripFlags = regexWithStripWarning(true)