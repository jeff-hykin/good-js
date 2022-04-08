#!/usr/bin/env -S deno run --allow-all
import { intersection, subtract } from "../source/set.js"
import { toRepresentation } from "../source/string.js"

var a,b,c,d

a = new Set([1,2])
b = new Set([1,2, a, 99, 1,2,3, 99])
console.debug(`toRepresentation(a) is:`,toRepresentation(a))
console.debug(`toRepresentation(b) is:`,toRepresentation(b))
console.log(`intersection(a, b)`, toRepresentation(intersection(a, b)))

console.log(`subtract({value:a, from:b})`, toRepresentation(subtract({value:a, from:b})))
console.log(`subtract({value:[...a,a], from:b})`, toRepresentation(subtract({value:[...a,a], from:b})))
