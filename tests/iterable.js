#!/usr/bin/env -S deno run --allow-all
import { asyncIteratorToList, concurrentlyTransform, Iterable, iter, next, Stop, zip, enumerate } from "../source/iterable.js"

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