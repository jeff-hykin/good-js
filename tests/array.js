#!/usr/bin/env -S deno run --allow-all
import { zip, enumerate, count, wrapAroundGet, combinations, permute, reversed } from "../source/array.js"
import { deepCopySymbol, allKeys } from "../source/value.js"

console.log((enumerate(['a','b'], ['A', 'B'], ['1', '2'])))
console.log((zip(['a','b'], ['A', 'B'], ['1', '2'])))
console.log(`combinations([1,2,3], 2)`, (combinations([1,2,3],2)))
console.log(`combinations([1,2,3], 3, 2)`, (combinations([1,2,3],3,2)))
console.log(`combinations([1,2,3])`, (combinations([1,2,3])))
console.log(`(permute(['i','g','y','m','u']))`, (permute(['i','g','y','m','u'])))
console.debug(`reversed([1,2,3]) is:`,reversed([1,2,3]))
console.debug(`reversed("[1,2,3]") is:`,reversed("[1,2,3]"))
