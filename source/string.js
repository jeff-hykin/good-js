
export const capitalize = (string) => string.replace(/\b\w/g, (chr) => chr.toUpperCase())
export const indent = ({ string, by="    ", noLead=false }) => (noLead?"":by) + string.replace(/\n/g, "\n" + by)

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