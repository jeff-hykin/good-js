import { afterIterable } from "../flattened/after_iterable.js"
import { iter } from "../flattened/iter.js"
import { testCallJsonify } from "../flattened/test_call_jsonify.js"

var newIterable = afterIterable([1, 2, 3]).then(()=>console.log("iter finished"))
for (const each of newIterable) {
    console.log(`each is:`,each)
}

console.log(`empty iterable test`)
var newIterable = afterIterable([]).then(()=>console.log("iter finished"))
for (const each of newIterable) {
    console.log(`each is:`,each)
}