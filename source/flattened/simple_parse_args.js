export function simpleParseArgs(args) {
    const flags = {}
    const namedArgs = {}
    const numberedArgs = []
    let doubleDashWasPassed = false
    let argName = null
    for (const each of args) {
        if (argName != null) {
            const name = argName
            argName = null
            // multiple entries of same argument become a list
            if (Object.keys(namedArgs).includes(name)) {
                namedArgs[name] = [ namedArgs[name], each ]
            } else {
                namedArgs[name] = each
            }
        }
        if (each == '--') {
            doubleDashWasPassed = true
        }
        if (doubleDashWasPassed) {
            numberedArgs.push(each)
            continue
        }
        if (each.startsWith("--")) {
            argName = each.slice(2,)
            continue
        } else if (each.startsWith("-")) {
            flags[each.slice(1,)] = true
        } else {
            numberedArgs.push(each)
        }
    }
    
    return {flags, namedArgs, numberedArgs}
}
