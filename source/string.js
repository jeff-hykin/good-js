module.exports = {
    capitalize: (string) => string.replace(/\b\w/g, (chr) => chr.toUpperCase()),
    indent: ({ string, by = "    " }) => by + string.replace(/\n/g, "\n" + by),
    snakeToCamelCase: (baseName) =>
        baseName
            .toLowerCase()
            .replace(/_/, " ")
            .replace(/.\b\w/g, (aChar) => aChar.toUpperCase())
            .replace(" ", ""),
    toCamelCase: (obj) => (typeof obj === "string") ? camelCase(obj) : walkObject(obj),
    varnameToTitle: (string) => string.replace(/_/, " ").replace(/\b\w/g, (chr) => chr.toUpperCase()),
    findAll(regexPattern, sourceString) {
        let output = []
        let match
        // make sure the pattern has the global flag
        let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
        while ((match = regexPatternWithGlobal.exec(sourceString))) {
            // get rid of the string copy
            delete match.input
            // store the match data
            output.push(match)
        }
        return output
    },
}

// 
// 
// below code is modified from: https://www.npmjs.com/package/camelize
// 
// 
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

function camelCase(str) {
    return str.replace(
        // capatalize almost all chars
        /[ _.-](\w|$)/g, (everything, group1) => group1.toUpperCase()
    ).replace(
        // make first one(s) lowercase
        /\b\w/g, (group1) => group1.toLowerCase()
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
