import {zip, enumerate, count, wrapAroundGet, permuteIter, combinationsIter, combinations } from "../source/itertools.js"

var a,b,c,d

console.log(JSON.stringify(enumerate(['a','b'], ['A', 'B'])))
console.log(JSON.stringify(zip(['a','b'], ['A', 'B'])))
console.log(`permuteIter([1,2,3])`, JSON.stringify([...permuteIter([1,2,3])]))
console.log(`combinations([1,2,3], 2)`, JSON.stringify(combinations([1,2,3],2)))