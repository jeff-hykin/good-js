#!/usr/bin/env -S deno run --allow-all
import { capitalize, indent, toCamelCase, toPascalCase, toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase, levenshteinDistanceOrdering, levenshteinDistanceBetween } from "../source/string.js"

console.log(`${capitalize("howdy_howdy_howdy")}`)
console.log(`${toCamelCase("howdy_howdy_howdy")}`)
console.log(`${toPascalCase("howdy_howdy_howdy")}`)
console.log(`${indent({string:"howdy_howdy_howdy"})}`)
console.debug(`levenshteinDistanceOrdering({word: "howdee", otherWords:[ "bob", "heydo", "how", "howdy", "gigem" ]}) is:`,levenshteinDistanceOrdering({word: "howdee", otherWords:[ "bob", "heydo", "how", "howdy", "gigem" ]}))
console.debug(`levenshteinDistanceBetween("howdy", "howdee") is:`,levenshteinDistanceBetween("howdy", "howdee"))