#!/usr/bin/env -S deno run --allow-all
import { asyncIteratorToList, concurrentlyTransform } from "../source/iterable.js"

const listOfSubpaths = await concurrentlyTransform({
    iterator: Deno.readDir("../"),
    awaitAll: true,
    transformFunction: (each, index)=>each.isDirectory&&[...Deno.readDirSync(`../${each.name}`)],
})
console.debug(`listOfSubpaths is:`,listOfSubpaths)