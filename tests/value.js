#!/usr/bin/env -S deno run --allow-all
import { deepCopy, allKeyDescriptions, deepSortObject, shallowSortObject } from "../source/value.js"

class Thing {
    doStuff() {
        return 10
    }
}
const a = new Thing()
a.howdy = "HOWDY!"

console.log(deepCopy(10))
console.log(allKeyDescriptions(a, {includingBuiltin:false}))
console.log(allKeyDescriptions(a, {includingBuiltin:true}))

const object = {
    b: 10,
    a: 11,
    c: [
        "howdy",
        {
            d: 9999,
            aye: 1,
        },
    ],
}
console.debug(`object is:`,object)
console.debug(`deepSortObjectResult is:`,deepSortObject(object))
console.debug(`shallowSortObjectResult is:`,shallowSortObject(object))