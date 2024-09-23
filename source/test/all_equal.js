import { allEqual } from "../flattened/all_equal.js"
import { testCallJsonify } from "../flattened/test_call_jsonify.js"

testCallJsonify(allEqual, [])
testCallJsonify(allEqual, [1, 2, 3])
testCallJsonify(allEqual, [0, []])
testCallJsonify(allEqual, [0, ""])
testCallJsonify(allEqual, [0, "", 0])
testCallJsonify(allEqual, ["hi", "something"])
testCallJsonify(allEqual, ["hi", "hi"])
testCallJsonify(allEqual, [1, 2, 3, 1, 2, 3])