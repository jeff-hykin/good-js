import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { withoutCommonSuffix } from "../flattened/without_common_suffix.js"

testCallJsonify(withoutCommonSuffix, [])
testCallJsonify(withoutCommonSuffix, ["cdef", "abcxyz", "abcmnop"])
testCallJsonify(withoutCommonSuffix, ["cdef", "cdef", "cdef"])
testCallJsonify(withoutCommonSuffix, ["abcdefnop", "abcxyznop", "abcmnop", "abcdefnop"])
testCallJsonify(withoutCommonSuffix, ["abcdef", "abcxyz", "aabcmnop", "abcdef", "abcxyz"])
testCallJsonify(withoutCommonSuffix, ["abcdef", "abcxyzf", "abcmnopf", "abcdef", "abcxyzf", "abcmnopf"])
testCallJsonify(withoutCommonSuffix, ["abcdef", "abcxyz", "abcmnop", "abcdef", "abcxyz", "abcmnop", "dabcdef"])
testCallJsonify(withoutCommonSuffix, ["abcdef"])
