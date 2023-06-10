
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