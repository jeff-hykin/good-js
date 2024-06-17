#!/usr/bin/env -S deno run --allow-all
import { stats, sum, spread, createLinearMapper} from "../source/math.js"
import { toRepresentation } from "../source/string.js"

console.log(toRepresentation(stats([1,2342,24,4])))
// example of using spread
console.log(toRepresentation(spread({ quantity: 10, min: 1.37, max: 7.86 })))
// example of using createLinearMapper
const mapper  = createLinearMapper({ min: 0, max: 100 }, { min: 0, max: 1 })
console.log(toRepresentation(mapper(0.5)))
console.log(toRepresentation(mapper(0.75)))
console.log(toRepresentation(mapper(1)))
console.log(toRepresentation(mapper(1.25)))
console.log(toRepresentation(mapper(1.5)))
console.log(toRepresentation(mapper(100)))