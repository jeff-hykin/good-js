import { afterIterable } from "../flattened/after_iterable.js"
import { iter } from "../flattened/iter.js"
import { testCallJsonify } from "../flattened/test_call_jsonify.js"

var arg = iter([1, 2, 3])
var newIterable = afterIterable(arg).then(()=>console.log("iter finished"))
for (const each of newIterable) {
    console.log(`each is:`,each)
}