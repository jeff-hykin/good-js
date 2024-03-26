import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { withoutCommonPrefix } from "../flattened/without_common_prefix.js"

testCallJsonify(withoutCommonPrefix, [])
testCallJsonify(withoutCommonPrefix, ["cdef", "abcxyz", "abcmnop"])
testCallJsonify(withoutCommonPrefix, ["cdef", "cdef", "cdef"])
testCallJsonify(withoutCommonPrefix, ["abcdef", "abcxyz", "abcmnop", "abcdef"])
testCallJsonify(withoutCommonPrefix, ["abcdef", "abcxyz", "aabcmnop", "abcdef", "abcxyz"])
testCallJsonify(withoutCommonPrefix, ["abcdef", "abcxyz", "abcmnop", "abcdef", "abcxyz", "abcmnop"])
testCallJsonify(withoutCommonPrefix, ["abcdef", "abcxyz", "abcmnop", "abcdef", "abcxyz", "abcmnop", "dabcdef"])