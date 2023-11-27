import { toCamelCase } from "./to_camel_case.js"

export const flag = Symbol("flagArg")
export const required = Symbol("requiredArg")
export function parseArgs({ rawArgs, fields, namesStopAfter="--", allowNameRepeats=true, camelCaseify=true, jsonCoerceValues=true, isolateTrailingArguments=false, namedArgSatisfiesNumberedArg=true, genericflagPrefix=/--|-/, }) {
    // 
    // organize the parameters
    // 
    const namesOfArgs = []
    const namedFlagList = []
    const nameToField = new Map()
    for (const [names, ...kind] of fields) {
        const isFlag = kind.includes(flag)
        const isRequired = kind.includes(required)
        const isFunction = kind.slice(-1)[0] instanceof Function
        const entry = {
            isRequired,
            isFlag,
            isFunction,
            names,
            kind,
            realIndices: [],
            value: undefined,
        }
        for (const each of names) {
            if (nameToField.has(each)) {
                throw Error(`When calling parseArgs(), there's at least two arguments that are both trying to use this name ${JSON.stringify(each)}. A name can only belong to one argument.`)
            }
            nameToField.set(each, entry)
            if (typeof each == 'string') {
                namesOfArgs.push(each)
            }
        }
        if (isFlag) {
            for (const each of names) {
                if (typeof each == "string") {
                    namedFlagList.push(each)
                }
            }
        }
    }

    // 
    // base arg parsing
    // 
    const numberedArgs = []
    const trailingArguments = []
    let stopParsingNamedArgs = false
    let argName = null
    let runningArgNumberIndex = -1
    let index = -1
    let nameStopIndex = null
    const handleNumberedArg = (each)=>{
        parse_next_numbered_arg: while (1) {
            const argNumberIndex = runningArgNumberIndex
            runningArgNumberIndex += 1
            if (!nameToField.has(argNumberIndex)) {
                nameToField.set(argNumberIndex, {
                    kind: "auto",
                    names: [ runningArgNumberIndex ],
                    realIndices: [index],
                    value: each,
                })
            } else {
                const entry = nameToField.get(argNumberIndex)
                // provided two values for one entry
                if (entry.value != undefined) {
                    if (namedArgSatisfiesNumberedArg) {
                        // this number arg has already been satisfied
                        // so we pretend that it was never a number arg
                        // and just immediately process the next numbered arg
                        // (providing a named arg for a numbered value removes it from the numbered-arg list)
                        continue parse_next_numbered_arg
                    } else if (allowNameRepeats) {
                        entry.value = [ entry.value, each ]
                    } else {
                        throw Error(`When calling parseArgs(), two values were given for the same entry (ex: "count $thisVal 5 --min $thisVal" instead of "count --min $thisVal --max 5" or "count $thisVal 5"). The second occurance was ${argName}, and the field was ${JSON.stringify(entry.names)}`)
                    }
                } else {
                    numberedArgs[runningArgNumberIndex] = each
                    entry.value = each
                }
                entry.realIndices.push(index)
            }
            break
        }
    }
    for (const each of rawArgs) {
        index += 1
        if (argName != null) {
            const name = argName
            argName = null
            if (!nameToField.has(name)) {
                nameToField.set(name, {
                    kind: "auto",
                    names: [each],
                    realIndices: [index],
                    value: each,
                })
            } else {
                const entry = nameToField.get(name)
                // provided two values for one entry
                if (entry.value != undefined) {
                    if (allowNameRepeats) {
                        entry.value = [ entry.value, each ]
                    } else {
                        throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${argName}, and the field was ${JSON.stringify(entry.names)} `)
                    }
                } else {
                    entry.value = each
                }
                entry.realIndices.push(index-1) // the name
                entry.realIndices.push(index)
            }
        }
        if (each == namesStopAfter) {
            stopParsingNamedArgs = true
            nameStopIndex = index
        }
        if (stopParsingNamedArgs) {
            trailingArguments.push(each)
            if (!isolateTrailingArguments) {
                handleNumberedArg(each)
            }
            continue
        }
        let match
        // boolean flag
        if (namedFlagList.includes(each)) {
            const name = each
            const entry = nameToField.get(name)
            // provided two values for one entry
            if (entry.value != undefined) {
                if (!allowNameRepeats) {
                    throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${argName}, and the field was ${JSON.stringify(entry.names)} `)
                }
            } else {
                entry.value = true
            }
            entry.realIndices.push(index)
        } else if (namesOfArgs.includes(each)) {
            argName = each
        } else if ((match = each.match(genericflagPrefix)) && match.index==0) {
            // arg value will be parsed next
            argName = each
        } else {
            handleNumberedArg(each)
        }
    }
    
    // 
    // post-process (validate, tranform, aggregate)
    // 
    const originalIndicesOf = new Map()
    const namedArgs = {}
    for (const eachEntry of new Set(nameToField.values())) {
        if (eachEntry.isRequired && eachEntry.value == undefined) {
            throw Error(`The ${eachEntry.names.join(" ")} field is required but it was not provided`)
        }
        if (eachEntry.isFlag) {
            eachEntry.value = !!eachEntry.value
        }
        if (eachEntry.isFunction) {
            if (eachEntry.value instanceof Array) {
                eachEntry.value = eachEntry.kind.slice(-1)[0](...eachEntry.value)
            } else {
                eachEntry.value = eachEntry.kind.slice(-1)[0](eachEntry.value)
            }
        } else if (jsonCoerceValues && !eachEntry.isFlag) {
            if (eachEntry.value instanceof Array) {
                let newValues = []
                for (const each of eachEntry.value) {
                    try {
                        newValues.push(JSON.parse(each))
                    } catch (error) {
                        newValues.push(each)
                    }
                }
                eachEntry.value = newValues
            } else if (eachEntry.value) {
                try {
                    eachEntry.value = JSON.parse(value)
                } catch (error) {
                    
                }
            }
        }
        for (const eachName of eachEntry.names) {
            if (typeof eachName == "number") {
                numberedArgs[eachName] = eachEntry.value
                originalIndicesOf.set(eachName, eachEntry.realIndices)
            } else if (typeof eachName == 'string') {
                namedArgs[eachName] = eachEntry.value
                originalIndicesOf.set(eachName, eachEntry.realIndices)
                if (camelCaseify) {
                    const camelName = toCamelCase(eachName)
                    originalIndicesOf.set(camelName, eachEntry.realIndices)
                    namedArgs[camelName] = eachEntry.value
                }
            }
        }
    }

    return { numberedArgs, namedArgs, originalIndicesOf }
}