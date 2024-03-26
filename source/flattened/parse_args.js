import { toCamelCase } from "./to_camel_case.js"

export const flag = Symbol("flagArg")
export const required = Symbol("requiredArg")
const unset = Symbol("unset")
class Default {
    constructor(val) {
        this.val = val
    }
}
export const initialValue = (value)=>new Default(value)
const coerseValue = (value, transformer)=>{
    if (value instanceof Array) {
        try {
            return transformer(value)
        } catch (error) {
            const newValues = []
            for (const each of value) {
                try {
                    newValues.push(transformer(each))
                } catch (error) {
                    newValues.push(each)
                }
            }
            return newValues
        }
    } else if (value !== undefined && value !== unset) {
        try {
            return transformer(value)
        } catch (error) {
            
        }
    }
    return value
}
export function parseArgs({
    rawArgs,
    fields,
    namedArgsStopper="--",
    allowNameRepeats=true,
    nameTransformer=toCamelCase,
    valueTransformer=JSON.parse,
    isolateArgsAfterStopper=false,
    argsByNameSatisfiesNumberedArg=true,
    implicitNamePattern=/^(--|-)[a-zA-Z0-9\-_]+$/,
    implictFlagPattern=null, 
}) {
    // 
    // organize the parameters
    // 
    const explicitNamesList = []
    const explicitFlagList = []
    const keyToField = new Map()
    for (const [keys, ...kind] of fields) {
        const isFlag = kind.includes(flag)
        const isRequired = kind.includes(required)
        const hasDefaultValue = kind.some(each=>each instanceof Default)
        const hasTransformer = kind.some(each=>each instanceof Function)
        const entry = {
            isRequired,
            isFlag,
            isExplicit: true,
            hasTransformer,
            wasNamed: false,
            keys,
            kind,
            realIndices: [],
            value: unset,
            hasDefaultValue,
            default: hasDefaultValue? kind.filter(each=>each instanceof Default)[0].val : undefined,
        }
        for (const each of keys) {
            if (keyToField.has(each)) {
                throw Error(`When calling parseArgs(), there's at least two arguments that are both trying to use this name ${JSON.stringify(each)}. A name can only belong to one argument.`)
            }
            keyToField.set(each, entry)
            if (typeof each == 'string') {
                explicitNamesList.push(each)
            }
        }
        if (isFlag) {
            for (const each of keys) {
                if (typeof each == "string") {
                    explicitFlagList.push(each)
                }
            }
        }
    }

    // 
    // base arg parsing
    // 
    const argsAfterStopper = [] // NOTE: not post-processed (e.g. valueTransformer is effectively always false for values in this array)
    const numberWasImplicit = []
    const nameWasImplicit = []
    let directArgList  = []      
    const argsByNumber = {}         // directArgList VS argsByNumber is best explained by an example
                                    //     if 
                                    //          fields = [
                                    //              [ ["--blah", 2,], required ]
                                    //          ]
                                    //          rawArgs = [ "0", "1", "3", "--blah", "2" ]
                                    //     then:
                                    //          directArgList[2] == "3"
                                    //          argsByName["--blah"] == "2"
                                    //          argsByNumber[2] == "2"
    let stopParsingArgsByName = false
    let argName = null
    let runningArgNumberIndex = -1
    let index = -1
    let nameStopIndex = null
    const numberedArgBuffer = []
    const handleNumberedArg = (index, each)=>{
        directArgList.push(each)
        parse_next_numbered_arg: while (1) {
            runningArgNumberIndex += 1
            if (!keyToField.has(runningArgNumberIndex)) {
                numberWasImplicit.push(runningArgNumberIndex)
                // console.debug(`- numbered arg was unknown`,)
                keyToField.set(runningArgNumberIndex, {
                    kind: [],
                    keys: [ runningArgNumberIndex ],
                    realIndices: [index],
                    value: each,
                })
            } else {
                // console.debug(`- numbered arg was known`,)
                const entry = keyToField.get(runningArgNumberIndex)
                // provided two values for one entry
                if (entry.value != undefined) {
                    if (argsByNameSatisfiesNumberedArg) {
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
                    argsByNumber[runningArgNumberIndex] = each
                    entry.value = each
                }
                entry.realIndices.push(index)
            }
            break
        }
    }
    for (const eachArg of rawArgs) {
        // console.debug(`keyToField.entries() is:`,[...keyToField.entries()])
        // console.debug(`eachArg is:`,eachArg)
        index += 1
        if (argName != null) {
            // console.debug(`- value of argName:`,argName)
            const name = argName
            argName = null
            if (!keyToField.has(name)) {
                nameWasImplicit.push(name)
                keyToField.set(name, {
                    wasNamed: true,
                    kind: [],
                    keys: [ name ],
                    realIndices: [index],
                    value: eachArg,
                })
            } else {
                const entry = keyToField.get(name)
                entry.wasNamed = true
                // provided two values for one entry
                if (entry.value !== unset) {
                    if (allowNameRepeats) {
                        entry.value = [ entry.value, eachArg ]
                    } else {
                        throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${name}, and the field was ${JSON.stringify(entry.keys)} `)
                    }
                } else {
                    entry.value = eachArg
                }
                entry.realIndices.push(index-1) // the name
                entry.realIndices.push(index)
            }
            continue
        }
        if (eachArg == namedArgsStopper) {
            // console.debug(`- eachArg is namedArgsStopper avalue`)
            stopParsingArgsByName = true
            nameStopIndex = index
            continue
        }
        if (stopParsingArgsByName) {
            // console.debug(`- is trailing argument`)
            argsAfterStopper.push(eachArg)
            if (!isolateArgsAfterStopper) {
                numberedArgBuffer.push([index, eachArg])
            }
            continue
        }
        let match
        // boolean flag
        if (explicitFlagList.includes(eachArg)) {
            // console.debug(`- is in explicitFlagList: ${JSON.stringify(explicitFlagList)}`)
            const entry = keyToField.get(eachArg)
            // provided two values for one entry
            if (entry.value != undefined) {
                if (!allowNameRepeats) {
                    throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${eachArg}, and the field was ${JSON.stringify(entry.keys)} `)
                }
            } else {
                entry.value = true
            }
            entry.realIndices.push(index)
        } else if (explicitNamesList.includes(eachArg)) {
            // console.debug(`- is in explicitNamesList: ${JSON.stringify(explicitNamesList)}`)
            argName = eachArg
        } else if (implicitNamePattern && (match = eachArg.match(implicitNamePattern))) {
            // console.debug(`- matches generic name pattern: ${implicitNamePattern}`)
            // arg value will be parsed next
            argName = eachArg
        } else if (implictFlagPattern && (match = eachArg.match(implictFlagPattern))) {
            // console.debug(`- matches generic flag pattern: ${implicitNamePattern}`)
            // arg value will be parsed next
            // console.debug(`- is in explicitFlagList: ${JSON.stringify(explicitFlagList)}`)
            if (!keyToField.has(eachArg)) {
                keyToField.set(runningArgNumberIndex, {
                    isFlag: true,
                    kind: [],
                    keys: [ eachArg ],
                    realIndices: [index],
                    value: true,
                })
            } else {
                // NOTE: its a design choice allowNameRepeats doesn't apply to implicit flags
                //       hopefully its a good choice
                keyToField.get(eachArg).realIndices.push(index)
            }
        } else {
            // console.debug(`- is numbered argument`)
            numberedArgBuffer.push([index, eachArg])
        }
    }
    // must handle numbered after named field inputs since name can substitute numbers
    for (const [index, each] of numberedArgBuffer) {
        handleNumberedArg(index, each)
    }
    // console.debug(`keyToField.entries() is:`,[...keyToField.entries()])
    
    // 
    // post-process (validate, tranform, aggregate)
    // 
    const simplifiedNames = {}
    const argsByName = {}
    const fieldSet = new Set(keyToField.values())
    for (const eachEntry of fieldSet) {
        const names = eachEntry.keys.filter(each=>typeof each == "string")
        if (names.length > 0) {
            if (!nameTransformer) {
                simplifiedNames[names[0]] = null
            } else {
                const transformedNames = names.map(nameTransformer).flat(1)
                simplifiedNames[transformedNames[0]] = null
                const newNames = transformedNames.filter(each=>!names.includes(each))
                eachEntry.keys = eachEntry.keys.concat(newNames)
                for (const newName of newNames) {
                    keyToField.set(newName, eachEntry)
                }
            }
        }
    }
    for (const eachEntry of fieldSet) {
        if (eachEntry.isRequired && eachEntry.value == unset) {
            throw Error(`\n\nThe ${eachEntry.keys.map(each=>typeof each =="number"?`[Arg #${each}]`:each).join(" ")} field is required but it was not provided\n`)
        }
        const usingDefaultValue = eachEntry.hasDefaultValue && eachEntry.value == unset
        if (usingDefaultValue) {
            eachEntry.value = eachEntry.default
        } else {
            if (eachEntry.hasTransformer) {
                for (const eachTransformer of eachEntry.kind) {
                    if (eachTransformer instanceof Function) {
                        eachEntry.value = eachTransformer(eachEntry.value)
                    }
                }
            } else if (valueTransformer && !eachEntry.isFlag) {
                eachEntry.value = coerseValue(eachEntry.value, valueTransformer)
            }
        }
        if (eachEntry.isFlag) {
            eachEntry.value = !!eachEntry.value
        }
        for (const eachName of eachEntry.keys) {
            if (typeof eachName == "number") {
                argsByNumber[eachName] = eachEntry.value
            } else if (typeof eachName == 'string') {
                argsByName[eachName] = eachEntry.value
            }
        }
    }
    // 
    // ensures alternative-args forms are post-processed
    // 
    const implicitArgsByName = {}
    const implicitArgsByNumber = []
    for (const { isExplicit, value, keys, } of fieldSet) {
        if (!isExplicit) {
            if (typeof keys[0] == "number") {
                implicitArgsByNumber.push(value)
            } else {
                implicitArgsByName[keys[0]] = value
                implicitArgsByName[nameTransformer(keys[0])] = value
            }
        }
    }
    const explicitArgsByName = {}
    const explicitArgsByNumber = []
    for (const { isExplicit, kind, value, keys, } of fieldSet) {
        if (isExplicit) {
            for (const eachKey of keys) {
                if (typeof eachKey == "number") {
                    explicitArgsByNumber[eachKey] = value
                } else {
                    explicitArgsByName[eachKey] = value
                }
            }
        }
    }
    for (const each of Object.keys(simplifiedNames)) {
        simplifiedNames[each] = argsByName[each]
    }
    if (valueTransformer) {
        directArgList = directArgList.map(each=>coerseValue(each,valueTransformer))
    }
    
    return {
        simplifiedNames,
        argList: explicitArgsByNumber.concat(implicitArgsByNumber),
        explicitArgsByNumber,
        implicitArgsByNumber,
        directArgList,
        argsAfterStopper,
        arg: (nameOrIndex)=>{
            if (typeof nameOrIndex == "number") {
                return argsByNumber[nameOrIndex]
            } else {
                return argsByName[nameOrIndex]
            }
        },
        fields: [...fieldSet],
        field: keyToField.get,
        explicitArgsByName,
        implicitArgsByName, 
        nameStopIndex,
    }
}