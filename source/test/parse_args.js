import { parseArgs, flag, required, initialValue } from "../flattened/parse_args.js"
import { toCamelCase } from "../flattened/to_camel_case.js"
import { didYouMean } from "../string.js"

var output = parseArgs({
    rawArgs: [ "1", "2", "--debug", "3", "--imImplicit", "howdy" ],
    fields: [
        [["--debug", "-o", ], flag, required, ],
        [["--version"], flag, initialValue(true) ],
        [["--explcit-arg1"], initialValue(null), (str)=>parseInt(str)],
    ],
    nameTransformer: toCamelCase,
    namedArgsStopper: "--",
    allowNameRepeats: true,
    valueTransformer: JSON.parse,
    isolateArgsAfterStopper: false,
    argsByNameSatisfiesNumberedArg: true,
    implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
    implictFlagPattern: null,
})
console.debug(`output.argList is:`,output.argList) // [ 1, 2, 3 ]
console.debug(`output.simplifiedNames is:`,output.simplifiedNames) // { debug: true, version: false, explcitArg1: NaN, imImplicit: "howdy" } 
console.debug(`output.field.version is:`,output.field.version) // { debug: true, version: false, explcitArg1: NaN, imImplicit: "howdy" } 
console.debug(`output.implicitArgsByNumber is:`,output.implicitArgsByNumber) // [1,2,3]
console.debug(`output.directArgList is:`,output.directArgList)
console.debug(`output.fields is:`,output.fields)
console.debug(`output.explicitArgsByName is:`,output.explicitArgsByName)
console.debug(`output.implicitArgsByName is:`,output.implicitArgsByName)
const validNames = Object.keys(output.explicitArgsByName).filter(each=>each.startsWith(`-`))
const invalidNames = Object.keys(output.implicitArgsByName).filter(each=>each.startsWith(`-`))
console.log(didYouMean({ givenWords: invalidNames, possibleWords: validNames,}))

{
    try {
        const output = parseArgs({
            rawArgs: [ "1", "2", "3", ],
            fields: [
                [["-o", "--option"], flag, required ],
                [["--version"], flag ],
                [["--number"], (value)=>parseInt(value)],
            ],
        })
        console.debug(`output is:`,output)
        console.debug(`output.numberedArgs.length is:`,output.numberedArgs.length)
        console.debug(`output.numberedArgs is:`,output.numberedArgs)
    } catch (error) {
        console.debug(`THERE SHOULD BE AN ERROR:`,error)
    }
    
}


var { from: source, to: target, absolute: isAbsolute } = output = parseArgs({
    rawArgs: [ "--from", "a", "--to", "b" ],
    fields: [
        [["--from", ], required, ],
        [["--to"], required, ],
        [["--absolute", ], flag, initialValue(false), JSON.parse ],
    ],
    allowNameRepeats: false,
    valueTransformer: (arg)=>arg, // as-is
}).simplifiedNames
console.debug(`output is:`,output) 