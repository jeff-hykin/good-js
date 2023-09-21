#!/usr/bin/env -S deno run --allow-all
import { capitalize, indent, toCamelCase, toPascalCase, toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase, levenshteinDistanceOrdering, levenshteinDistanceBetween, extractFirst, regex, toRepresentation, didYouMean } from "../source/string.js"

console.log(`${capitalize("howdy_howdy_howdy")}`)
console.log(`${toCamelCase("howdy_howdy_howdy")}`)
console.log(`${toPascalCase("howdy_howdy_howdy")}`)
console.log(`${indent({string:"howdy_howdy_howdy"})}`)
console.debug(`levenshteinDistanceOrdering({word: "howdee", otherWords:[ "bob", "heydo", "how", "howdy", "gigem" ]}) is:`,levenshteinDistanceOrdering({word: "howdee", otherWords:[ "bob", "heydo", "how", "howdy", "gigem" ]}))
console.debug(`levenshteinDistanceBetween("howdy", "howdee") is:`,levenshteinDistanceBetween("howdy", "howdee"))

// basic example
var remaining = "blah thing3: num8: 1"
var { remaining, extraction: thing, } = extractFirst({ pattern: /thing\d: /, from: remaining })
var { remaining, extraction: num,   } = extractFirst({ pattern: /num\d: /, from: remaining })
// NOTE: the "blah" is still there. Use "^" e.g. /^thing/ to only extract from the front
console.log(remaining === "blah 1") // true
console.log(thing === "thing3: ") // true

// full example
var remaining = "blah thing3: num8: 1"
var { preText, match, extraction, postText, remaining } = extractFirst({ pattern: /thing(\d): /, from: remaining })
console.debug(`({ preText, match, extraction, postText, remaining }) is:`,({ preText, match, extraction, postText, remaining }))
// preText == "blah "
// match == [ index: 5, "thing5: ", "5" ] // usual regex match object
// extraction == "thing5: "
// postText == "num8: 1"
// remaining == "blah num8: 1"

var output = regex`howdy${"(parens)"}${/(captureGroup)/}`.i
console.log(`regex is:`,output.toString())

var someName = "nameWithWeirdSymbols\\d(1)$@[]"
var somePattern = /\d+\.\d+/
var combined = regex`blah ${someName} blah ${somePattern}`.i
// the string is regex-escaped, but the regex is kept as-is
console.log(combined.toString()) 

var someName = "nameWithWeirdSymbols\\d(1)$@[]"
var versionPattern = /\d+\.\d+\.\d+/
var combined = regex`blah "${someName}"@${versionPattern}`.i
// the string is regex-escaped, but the regex is kept as-is:
console.log(`combined is:`,combined.toString())

// NOTE: interpolating with flags will give a warning that they will be stripped:
var versionPattern2 = /\d+\.\d+\.\d+/iu
console.warn = console.log // to make it use stdout
console.log("should show warning")
console.debug(`regex\`blah thing@\${versionPattern}\` is:`,regex`blah thing@${versionPattern2}`.toString())
// use this to intentionally strip flags
console.log("should not show warning")
console.debug(`regex.stripFlags\`blah thing@\${versionPattern}\` is:`,regex.stripFlags`blah thing@${versionPattern2}`.toString())

class A {}
var a = new A
a.thing = 10
function blahFunc() {
    return 10
}
console.debug(`toRepresentation(Symbol.for("howdy")) is:`,toRepresentation(Symbol.for("howdy")))
console.debug(`toRepresentation(Symbol("howdy")) is:`,toRepresentation(Symbol("howdy")))
console.debug(`toRepresentation(Symbol()) is:`,toRepresentation(Symbol()))
console.debug(`toRepresentation(null) is:`,toRepresentation(null))
console.debug(`toRepresentation(undefined) is:`,toRepresentation(undefined))
console.debug(`toRepresentation(a) is:`,toRepresentation(a))
console.debug(`toRepresentation(A) is:`,toRepresentation(A))
console.debug(`toRepresentation(blahFunc) is:`,toRepresentation(blahFunc))
console.debug(`toRepresentation(new Date(9999)) is:`,toRepresentation(new Date(9999)))

var possibleWords = [ "length", "size", "blah", "help", ]
var badArg = "hep"
console.debug(`didYouMean({ givenWord: badArg, possibleWords }) is:`,didYouMean({ givenWord: badArg, possibleWords }))