#!/usr/bin/env -S deno run --allow-all
import { zip, enumerate, count, wrapAroundGet, combinations } from "../source/array.js"
import { deepCopySymbol, allKeys } from "../source/value.js"

console.log((enumerate(['a','b'], ['A', 'B'], ['1', '2'])))
console.log((zip(['a','b'], ['A', 'B'], ['1', '2'])))
console.log(`combinations([1,2,3], 2)`, (combinations([1,2,3],2)))
console.log(`combinations([1,2,3], 3, 2)`, (combinations([1,2,3],3,2)))
console.log(`combinations([1,2,3])`, (combinations([1,2,3])))
