import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { removeCommonPrefix } from "../flattened/remove_common_prefix.js"

testCallJsonify(removeCommonPrefix, [])
testCallJsonify(removeCommonPrefix, ["cdef", "abcxyz", "abcmnop"])
testCallJsonify(removeCommonPrefix, ["cdef", "cdef", "cdef"])
testCallJsonify(removeCommonPrefix, ["abcdefnop", "abcxyznop", "abcmnop", "abcdefnop"])
testCallJsonify(removeCommonPrefix, ["abcdef", "abcxyz", "aabcmnop", "abcdef", "abcxyz"])
testCallJsonify(removeCommonPrefix, ["abcdef", "abcxyzf", "abcmnopf", "abcdef", "abcxyzf", "abcmnopf"])
testCallJsonify(removeCommonPrefix, ["abcdef", "abcxyz", "abcmnop", "abcdef", "abcxyz", "abcmnop", "dabcdef"])
testCallJsonify(removeCommonPrefix, ["abcdef"])
