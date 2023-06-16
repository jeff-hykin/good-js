import { zip } from "./iterable.js"
export const capitalize = (string) => string.replace(/\b\w/g, (chr) => chr.toUpperCase())

/**
 * indent
 *
 * @param arg1.string - the string to indent
 * @param arg1.by - the string to use as a form of indentation (e.g. spaces or tabs)
 * @param arg1.noLead - when true only newlines will be indented, not the first line
 * @returns {String} output
 *
 * @example
 *     indentedString = indent({string: "blah\n    blah\nblah", by: "\t", noLead: false })
 */
export const indent = ({ string, by="    ", noLead=false }) => (noLead?"":by) + string.replace(/\n/g, "\n" + by)

/**
 * More Reliable than .toString()
 *
 * @returns {String} 
 * @example
 *     `${Symbol("blah")}` // throws error
 *     toString(Symbol("blah")) // '[Symbol("blah")]'
 */
export const toString = (value)=>{
    // no idea why `${Symbol("blah")}` throws an error (and is the only primitive that throws)
    if (typeof value == 'symbol') {
        return `Symbol(${toRepresentation(value.description)})`
    // all other primitives
    } else if (!(value instanceof Object)) {
        return value != null ? value.toString() : `${value}`
    // instead of [Object object]
    } else {
        return toRepresentation(value)
    }
}

export const digitsToEnglishArray = (value)=>{
    // digits
    value = toString(value)
    if (value.length > 1) {
        // split into digits then put back together
        return [].concat(...[...value].map(each=>digitsToEnglishArray(each)))
    }
    if (value === "-") {
        return [ "negative" ]
    } else if (value === ".") {
        return [ "point" ]
    } else if (value === "0") {
        return [ "zero" ]
    } else if (value === "1") {
        return [ "one" ]
    } else if (value === "2") {
        return [ "two" ]
    } else if (value === "3") {
        return [ "three" ]
    } else if (value === "4") {
        return [ "four" ]
    } else if (value === "5") {
        return [ "five" ]
    } else if (value === "6") {
        return [ "six" ]
    } else if (value === "7") {
        return [ "seven" ]
    } else if (value === "8") {
        return [ "eight" ]
    } else if (value === "9") {
        return [ "nine" ]
    } else {
        return ""
    }
}

/**
 * python's repr() for JS
 *
 */
export const toRepresentation = (item)=>{
    const alreadySeen = new Set()
    const recursionWrapper = (item)=>{
        // prevent infinite recursion
        if (item instanceof Object) {
            if (alreadySeen.has(item)) {
                return `[Self Reference]`
            } else {
                alreadySeen.add(item)
            }
        }

        let output
        if (typeof item == 'string') {
            output = `"${item.replace(/"|\n|\t|\r|\\/g, (char)=>{
                switch (char) {
                    case '"': return '\\"'
                    case '\n': return '\\n'
                    case '\t': return '\\t'
                    case '\r': return '\\r'
                    case '\\': return '\\\\'
                }
            })}"`
        } else if (item instanceof Array) {
            output = `[${item.map(each=>recursionWrapper(each)).join(",")}]`
        } else if (item instanceof Set) {
            output = `{${([...item]).map(each=>recursionWrapper(each)).join(",")}}`
        // pure object
        } else if (item instanceof Object && item.constructor == Object) {
            let string = "{"
            for (const [key, value] of Object.entries(item)) {
                const stringKey = recursionWrapper(key)
                const stringValue = recursionWrapper(value)
                string += `\n  ${stringKey}: ${indent({string:stringValue, by:"  ", noLead:true})},`
            }
            string += "\n}"
            output = string
        // map
        } else if (item instanceof Map) {
            let string = "Map {"
            for (const [key, value] of item.entries()) {
                const stringKey = recursionWrapper(key)
                const stringValue = recursionWrapper(value)
                if (!stringKey.match(/\n/g)) {
                    string += `\n  ${stringKey} => ${indent({string:stringValue, by:"  ", noLead:true})},`
                // multiline key
                } else {
                    string += `\n  ${indent({string:stringKey, by:"  ", noLead:true})}\n    => ${indent({string:stringValue, by:"    ", noLead:true})},`
                }
            }
            string += "\n}"
            output = string
        } else {
            output = item != null ? item.toString() : `${item}`
        }
        
        return output
    }
    return recursionWrapper(item)
}

export const wordList = (str) => {
    const addedSeperator = str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9 _.-]/,"_").toLowerCase()
    const words = addedSeperator.split(/[ _.-]+/g)
    return words
}

export const toCamelCase = (str) => {
    const words = wordList(str)
    const capatalizedWords = words.map(each=>each.replace(/^\w/, (group0)=>group0.toUpperCase()))
    // make the first one lowercase
    capatalizedWords[0] = capatalizedWords[0].toLowerCase()
    return capatalizedWords.join('')
}

export const toPascalCase = (str) => {
    const words = wordList(str)
    const capatalizedWords = words.map(each=>each.replace(/^\w/, (group0)=>group0.toUpperCase()))
    return capatalizedWords.join('')
}

export const toKebabCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toLowerCase()).join('-')
}

export const toSnakeCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toLowerCase()).join('_')
}

export const toScreamingtoKebabCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toUpperCase()).join('-')
}

export const toScreamingtoSnakeCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toUpperCase()).join('_')
}

export const findAll = (regexPattern, sourceString) => {
    var output = []
    var match
    // auto-add global flag while keeping others as-is
    var regexPatternWithGlobal = regexPattern.global ? regexPattern : RegExp(regexPattern, regexPattern.flags+"g")
    while (match = regexPatternWithGlobal.exec(sourceString)) {
        // store the match data
        output.push(match)
        // zero-length matches will end up in an infinite loop, so increment by one char after a zero-length match is found
        if (match[0].length == 0) {
            regexPatternWithGlobal.lastIndex += 1
        }
    }
    return output
}

/**
 * extract a regex pattern and get the remaining data
 *
 * @example
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

export function* iterativelyFindAll(regexPattern, sourceString) {
    var match
    // auto-add global flag while keeping others as-is
    const regexPatternWithGlobal = regexPattern.global ? regexPattern : RegExp(regexPattern, regexPattern.flags+"g")
    while (match = regexPatternWithGlobal.exec(sourceString)) {
        // store the match data
        yield match
        // zero-length matches will end up in an infinite loop, so increment by one char after a zero-length match is found
        if (match[0].length == 0) {
            regexPatternWithGlobal.lastIndex += 1
        }
    }
    return output
}

// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
export function escapeRegexMatch(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
export function escapeRegexReplace(string) {
    return string.replace(/\$/g, '$$$$')
}

// 
// regex`pattern${/stuff/}${`stuff`}`.i
// 
    // these are helpers for the .i part, which requires a proxy object
    // declaring it out here saves on memory so there aren't a million instances of expensive proxy objects
    let proxyRegExp
    const regexProxyOptions = Object.freeze({
        get(original, key) {
            // if its flags, return a copy with those flags set
            if (key.match(/^[igymu]+$/)) {
                return proxyRegExp(original, key)
            }
            return original[key]
        },
        set(original, key, value) {
            return original[key] = value
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
                    if (!shouldStrip && (value.ignoreCase||value.sticky||value.multiline||value.unicode)) {
                        console.warn(`Warning: flags inside of regex:\n    The RegExp trigging this warning is: ${value}\n    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)\n    one of the \${} values (the one above) was a RegExp with a flag enabled\n    e.g. /stuff/i  <- i = ignoreCase flag enabled\n    When the /stuff/i gets interpolated, its going to loose its flags\n    (thats what I'm warning you about)\n    \n    To disable/ignore this warning do:\n        regex.stripFlags\`something\${/stuff/i}\`\n    If you want to add flags to the output of regex\`something\${stuff}\` do:\n        regex\`something\${stuff}\`.i   // ignoreCase\n        regex\`something\${stuff}\`.ig  // ignoreCase and global\n        regex\`something\${stuff}\`.gi  // functionally equivlent\n`)
                    }
                    // ex; `/blah/i` => `blah`
                    const regexContent = `${value}`.slice(1,).replace(/\/.*$/,"")
                    
                    // the `(?: )` is a non-capture group to prevent alternation from becoming a problem
                    // for example: `a|b` + `c|d` becoming `a|bc|d` (bad/incorrect) instead of becoming `(?:a|b)(?:c|d)` (correct)
                    newRegexString += `(?:${regexContent})`
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
     * 
     * @param arg1 - a template string
     * @returns {RegExp} output
     *
     */
    export const regex = regexWithStripWarning(false)
    regex.stripFlags = regexWithStripWarning(true)

// https://stackoverflow.com/questions/2460177/edit-distance-in-python, translated to JS
export function levenshteinDistanceBetween(s1, s2) {
    if (s1.length > s2.length) {
        ;[s1, s2] = [s2, s1]
    }

    let distances = Array.from({ length: s1.length + 1 }, (_, i) => i)
    for (let i2 = 0; i2 < s2.length; i2++) {
        let distances_ = [i2 + 1]
        for (let i1 = 0; i1 < s1.length; i1++) {
            let c1 = s1[i1]
            let c2 = s2[i2]
            if (c1 === c2) {
                distances_.push(distances[i1])
            } else {
                distances_.push(1 + Math.min(distances[i1], distances[i1 + 1], distances_[distances_.length - 1]))
            }
        }
        distances = distances_
    }
    return distances[distances.length - 1]
}

/**
 * Sorts an array of words based on their Levenshtein distance to a target word.
 *
 * @param {Object} options - The options for sorting.
 * @param {string} options.word - The target word for calculating Levenshtein distances.
 * @param {string[]} options.otherWords - An array of words to be sorted.
 * @returns {string[]} The sorted array of words based on their Levenshtein distance to the target word.
 */
export function levenshteinDistanceOrdering({ word, otherWords }) {
    word = word.toLowerCase()
    let prioritized = [...otherWords].sort((a, b) => levenshteinDistanceBetween(word, a) - levenshteinDistanceBetween(word, b))
    return prioritized
}

const textDecoder = new TextDecoder('utf-8')
const textEncoder = new TextEncoder('utf-8')
export const utf8BytesToString = textDecoder.decode.bind(textDecoder)
export const stringToUtf8Bytes = textEncoder.encode.bind(textEncoder)