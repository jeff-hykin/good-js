import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { commonPrefix } from "../flattened/common_prefix.js"

testCallJsonify(commonPrefix, [])
testCallJsonify(commonPrefix, ["aadfjlajf", "aadfjlajf", "aadfjlajf"])
testCallJsonify(commonPrefix, ["aa", "ab", "abc"])
testCallJsonify(commonPrefix, ["ab", "ab", "abc"])
testCallJsonify(commonPrefix, ["", "ab", "abc"])
testCallJsonify(commonPrefix, ["adfads", "ab", "abc"])
testCallJsonify(commonPrefix, ["edfads", "ab", "abc"])