
export const capitalize = (string) => string.replace(/\b\w/g, (chr) => chr.toUpperCase())
export const indent = ({ string, by = "    " }) => by + string.replace(/\n/g, "\n" + by)

export const wordList = (str) => {
    const addedSeperator = str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9 _.-]/,"_").toLowerCase()
    const words = addedSeperator.split(/[ _.-]+/g)
    return words
    const capatalizedWords = words.map(each=>each.replace(/^\w/, (group0)=>group0.toUpperCase()))
    // make the first one lowercase
    capatalizedWords[0] = capatalizedWords[0].toLowerCase()
    return capatalizedWords.join('')
}

export const camelCase = (str) => {
    const words = wordList(str)
    const capatalizedWords = words.map(each=>each.replace(/^\w/, (group0)=>group0.toUpperCase()))
    // make the first one lowercase
    capatalizedWords[0] = capatalizedWords[0].toLowerCase()
    return capatalizedWords.join('')
}

export const pascalCase = (str) => {
    const words = wordList(str)
    const capatalizedWords = words.map(each=>each.replace(/^\w/, (group0)=>group0.toUpperCase()))
    return capatalizedWords.join('')
}

export const kebabCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toLowerCase()).join('-')
}

export const snakeCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toLowerCase()).join('_')
}

export const screamingKebabCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toUpperCase()).join('-')
}

export const screamingSnakeCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toUpperCase()).join('_')
}

export const findAll = (regexPattern, sourceString) => {
    const output = []
    let match
    // make sure the pattern has the global flag
    const regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
    while ((match = regexPatternWithGlobal.exec(sourceString))) {
        // get rid of the string copy
        delete match.input
        // store the match data
        output.push(match)
    }
    return output
}

// 
// 
// below code is modified from: https://www.npmjs.com/package/camelize
// 
// 
// TODO: verify this then clean it up and export part of it
function walkObject(obj) {
    if (!obj || typeof obj !== "object") return obj
    if (isDate(obj) || isRegex(obj)) return obj
    if (isArray(obj)) return map(obj, walkObject)
    return reduce(
        objectKeys(obj),
        function (acc, key) {
            const camel = camelCase(key)
            acc[camel] = walkObject(obj[key])
            return acc
        },
        {}
    )
}
const isArray =
    Array.isArray ||
    function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]"
    }
const isDate = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Date]"
}
const isRegex = function (obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]"
}
const objectKeys =
    Object.keys ||
    function (obj) {
        const keys = []
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key)
        }
        return keys
    }
function map(xs, f) {
    if (xs.map) return xs.map(f)
    const res = []
    for (const i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i))
    }
    return res
}
function reduce(xs, f, acc) {
    if (xs.reduce) return xs.reduce(f, acc)
    for (const i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i)
    }
    return acc
}
