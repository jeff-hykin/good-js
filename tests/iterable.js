#!/usr/bin/env -S deno run --allow-all
import { asyncIteratorToList, concurrentlyTransform, Iterable, iter, next, Stop, zip, enumerate, forkAndFilter } from "../source/iterable.js"

const listOfSubpaths = await concurrentlyTransform({
    iterator: Deno.readDir("../"),
    awaitAll: true,
    transformFunction: (each, index)=>each.isDirectory&&[...Deno.readDirSync(`../${each.name}`)],
})

console.debug(`listOfSubpaths is:`,listOfSubpaths)
const subpaths = Iterable(concurrentlyTransform({
    iterator: Deno.readDir("../"),
    transformFunction: (each, index)=>each.isDirectory&&[...Deno.readDirSync(`../${each.name}`)],
}))

let result = await subpaths.filter((each)=>each).flattened.toArray
const manualFlat = listOfSubpaths.flat(100)
console.debug(`result is:`,result)
console.debug(`manualFlat.length == result.length is:`,`${manualFlat.length} == ${result.length} is:`,manualFlat.length == result.length)

for (const [index, eachResult, eachManualFlat] of enumerate(result, manualFlat)) {
    if (JSON.stringify(eachResult) != JSON.stringify(eachManualFlat)) {
        console.debug(`eachResult is:`,eachResult)
        console.debug(`eachManualFlat is:`,eachManualFlat)
        console.debug(`index is:`,index)
        break
    }
}

var { even, odd, divisBy3 } = forkAndFilter({
    data: [1,2,3,4,5],
    filters: {
        even:     value=>value%2 == 0,
        odd:      value=>value%2 != 0,
        divisBy3: value=>value%3 == 0,
    },
})
console.log("normal output")
console.log([...even     ]) // 2,4
console.log([...odd      ]) // 1,3,5
console.log([...divisBy3 ]) // 3

var { even, odd, divisBy3 } = forkAndFilter({
    data: [1,2,3,4,5],
    outputArrays: true,
    filters: {
        even:     value=>value%2 == 0,
        odd:      value=>value%2 != 0,
        divisBy3: async (value)=>value%3 == 0,
    },
})

console.log("one is async output")
console.log(even     ) // 2,4
console.log(odd      ) // 1,3,5
console.log(divisBy3 ) // 3