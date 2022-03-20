
export const capitalize = (string) => string.replace(/\b\w/g, (chr) => chr.toUpperCase())
export const indent = ({ string, by="    ", noLead=false }) => (noLead?"":by) + string.replace(/\n/g, "\n" + by)

export const toRepresentation = (item)=>{
    if (typeof item == 'string') {
        return `"${string.replace(/"|\n|\t|\r|\\/g, (char)=>{
            switch (char) {
                case '"': return '\\"'
                case '\n': return '\\n'
                case '\t': return '\\t'
                case '\r': return '\\r'
                case '\\': return '\\\\'
            }
        })}`
    }
    if (item instanceof Array) {
        return `[${item.map(each=>toRepresentation(each)).join(",")}]`
    }
    if (item instanceof Set) {
        return `{${item.map(each=>toRepresentation(each)).join(",")}}`
    }
    // pure object
    if (item instanceof Object && item.constructor == Object) {
        let string = "{"
        for (const [key, value] of Object.entries(item)) {
            const stringKey = toRepresentation(key)
            const stringValue = toRepresentation(value)
            string += `\n  ${stringKey}: ${indent({string:stringValue, by:"  ", noLead:true})},`
        }
        string += "\n}"
        return string
    }
    // map
    if (item instanceof Map) {
        let string = "Map {"
        for (const [key, value] of item.entries()) {
            const stringKey = toRepresentation(key)
            const stringValue = toRepresentation(value)
            if (!stringKey.match(/\n/g)) {
                string += `\n  ${stringKey} => ${indent({string:stringValue, by:"  ", noLead:true})},`
            // multiline key
            } else {
                string += `\n  ${indent({string:stringKey, by:"  ", noLead:true})}\n    => ${indent({string:stringValue, by:"    ", noLead:true})},`
            }
        }
        string += "\n}"
        return string
    }
    return item ? item.toString() : `${item}`
}

export const wordList = (str) => {
    const addedSeperator = str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9 _.-]/,"_").toLowerCase()
    const words = addedSeperator.split(/[ _.-]+/g)
    return words
    const capatalizedWords = words.map(each=>each.replace(/^\w/, (group0)=>group0.toUpperCase()))
    // make the first one lowercase
    capatalizedWords[0] = capatalizedWords[0].toLowerCase()
    return capatalizedWords.join('')
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