import { copyableInnerCombinations, zip, enumerate, count, wrapAroundGet, permuteIter, combinationsIter, combinations } from "../source/itertools.js"
import { deepCopySymbol, allKeys } from "../source/value.js"

console.log((enumerate(['a','b'], ['A', 'B'])))
console.log((zip(['a','b'], ['A', 'B'])))
console.log(`permuteIter([1,2,3])`, ([...permuteIter([1,2,3])]))
console.log(`combinations([1,2,3], 2)`, (combinations([1,2,3],2)))
console.log(`combinations([1,2,3], 3, 2)`, (combinations([1,2,3],3,2)))
console.log(`combinations([1,2,3])`, (combinations([1,2,3])))


// 
// for partitionsIter
// 
console.log(`copyableInnerCombinations([1,2,3,4,5,6],2)`)
const iterator = copyableInnerCombinations([1,2,3,4,5,6], 2)
let copy
let firstPart = 0
for (let each of iterator) {
    console.debug(`each is:`,each)
    firstPart++
    if (firstPart == 3) {
        console.log(`make copy`)
        copy = iterator[deepCopySymbol]()
    }
}
console.log(`copy`)
for (let each of copy) {
    console.debug(`copy is:`,each)
}