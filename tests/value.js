#!/usr/bin/env -S deno run --allow-all
import { deepCopy, allKeyDescriptions } from "../source/value.js"

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
