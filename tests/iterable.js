#!/usr/bin/env -S deno run --allow-all
import { map, filter, concat, reversed, after, frequencyCount, asyncIteratorToList, concurrentlyTransform, Iterable, iter, next, Stop, zip, enumerate, forkBy, flattened } from "../source/iterable.js"


var basicArrayIterable = [
    [
        1.0,
        [
            '1.1.1',
            '1.1.2',
            '1.1.3',
        ],
        1.2,
        [
            '1.3.1',
            '1.3.2',
            '1.3.3',
        ],
    ],
    [
        2.0,
        [
            '2.1.1',
            '2.1.2',
            '2.1.3',
        ],
        2.2,
        [
            '2.3.1',
            '2.3.2',
            '2.3.3',
        ],
    ],
]

const asyncExampleGenerator = async function*() {
    for (let each of basicArrayIterable) {
        yield each
    }
}
const asyncExampleGeneratorWithThrow = async function*() {
    let index = -1
    for (let each of basicArrayIterable) {
        throw Error(`Testing throw`)
    }
}

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

var { even, odd, divisBy3 } = forkBy({
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

var { even, odd, divisBy3 } = forkBy({
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



var flattenedItems = flattened({
    depth: 0,
    iterable: basicArrayIterable,
})
console.debug(`flattened(depth=0) is:`,flattenedItems)
var flattenedItems = flattened({
    iterable: basicArrayIterable,
    depth: 1,
})
console.debug(`flattenedItems(depth=1) is:`,[...flattenedItems])
var flattenedItems = flattened({
    iterable: basicArrayIterable,
    depth: 2,
})
console.debug(`flattenedItems(depth=2) is:`,[...flattenedItems])


console.debug(`reversed("howdy") is:`,reversed("howdy"))
console.debug(`reversed(new Set([..."howdy"])) is:`,reversed(new Set([..."howdy"])))
console.debug(`reversed(([..."howdy"])) is:`,reversed(([..."howdy"])))



console.debug(`new Iterable(basicArrayIterable).flat() is:`,[...new Iterable(basicArrayIterable).flat()])
console.debug(`new Iterable(async basicArrayIterable).flat() is:`,await asyncIteratorToList( new Iterable(asyncExampleGenerator()).flat() ))

console.debug(`[...map([1,2,3], each=>each+1)] is:`,[...map([1,2,3], each=>each+1)])

console.debug(`frequencyCount([11,11,44,44,9,44,0,0,1,99]) is:`,frequencyCount([11,11,44,44,9,44,0,0,1,99]))

console.debug(`concat() is:`,await asyncIteratorToList( concat(asyncExampleGenerator(), asyncExampleGenerator())))

console.debug(`Iterable(asyncExampleGenerator()).then() is:`,await Iterable(asyncExampleGenerator()).then((iterable, size)=>console.log(`howdy, size was: ${size}`)).toArray)


// console.debug(
//     `after() is:`, 
//     await asyncIteratorToList(
//         after(
//             asyncExampleGenerator()
//         ).then(
//             ()=>console.log("finished")
//         ) 
//     )
// )

// try {
//     console.debug(
//         `after() is:`, 
//         await asyncIteratorToList(
//             after(
//                 asyncExampleGeneratorWithThrow()
//             ).then(
//                 ()=>console.log("'then' before finally (uncaught error)")
//             ).finally(
//                 ()=>console.log("closing such and such (uncaught error)")
//             )
//         )
//     )
// } catch (error) {
//     console.log(`expected error: ${error}`)
// }

var arg = asyncExampleGeneratorWithThrow()
console.debug(`arg is:`,arg)
var asyncArg = (
    after(
        arg
    ).catch(
        (...args)=>console.debug(`There was an error: ${args}`)
    ).finally(
        ()=>console.log("closing such and such (caught error)")
    ).then(
        ()=>console.log("'then' after finally (caught error)")
    ) 
)
console.debug(`asyncArg is:`, asyncArg)
console.debug(
    `after() is:`, 
    await asyncIteratorToList(
        asyncArg
    )
)
// try {
    
//     console.debug(
//         `after() is:`, 
//         await asyncIteratorToList(
//             after(
//                 asyncExampleGenerator()
//             ).catch(
//                 (...args)=>console.debug(`There was an error: ${args}`)
//             ).finally(
//                 ()=>console.log("closing such (no error)")
//             ).then(
//                 ()=>console.log("'then' after (no error)")
//             )  
//         )
//     )
// } catch (error) {
//     console.debug(`error is:`,error)
// }