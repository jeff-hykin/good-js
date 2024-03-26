import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { removeCommonSuffix } from "../flattened/remove_common_suffix.js"

testCallJsonify(removeCommonSuffix, [])
testCallJsonify(removeCommonSuffix, ["cdef", "abcxyz", "abcmnop"])
testCallJsonify(removeCommonSuffix, ["cdef", "cdef", "cdef"])
testCallJsonify(removeCommonSuffix, ["abcdefnop", "abcxyznop", "abcmnop", "abcdefnop"])
testCallJsonify(removeCommonSuffix, ["abcdef", "abcxyz", "aabcmnop", "abcdef", "abcxyz"])
testCallJsonify(removeCommonSuffix, ["abcdef", "abcdef", "abcmnopdef", "abcdef", "abcxyzdef", "abcmnopdef"])
testCallJsonify(removeCommonSuffix, ["abcdef_", "abcxyz_", "abcmnop_", "abcdef_", "abcxyz_", "abcmnop_", "dabcdef_"])
testCallJsonify(removeCommonSuffix, ["abcdef_", "abcxyz_", "abcmnop_", "abcdef_", "abcxyz", "abcmnop_", "dabcdef_"])