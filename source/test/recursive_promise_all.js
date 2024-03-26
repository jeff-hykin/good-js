import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { recursivePromiseAll } from "../flattened/recursive_promise_all.js"


await testCallJsonify(recursivePromiseAll, {a:1, b: [ 1, 2, new Promise((resolve, reject)=>resolve(10))] })