import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { removeCommonSuffix } from "../flattened/remove_common_suffix.js"

console.log();testCallJsonify(removeCommonSuffix, [])
console.log();testCallJsonify(removeCommonSuffix, ["cdef", "abcxyz", "abcmnop"])
console.log();testCallJsonify(removeCommonSuffix, ["cdef", "cdef", "cdef"])
console.log();testCallJsonify(removeCommonSuffix, ["abcdefnop", "abcxyznop", "abcmnop", "abcdefnop"])
console.log();testCallJsonify(removeCommonSuffix, ["abcdef", "abcxyz", "aabcmnop", "abcdef", "abcxyz"])
console.log();testCallJsonify(removeCommonSuffix, ["abcdef", "abcdef", "abcmnopdef", "abcdef", "abcxyzdef", "abcmnopdef"])
console.log();testCallJsonify(removeCommonSuffix, ["abcdef_", "abcxyz_", "abcmnop_", "abcdef_", "abcxyz_", "abcmnop_", "dabcdef_"])
console.log();testCallJsonify(removeCommonSuffix, ["abcdef_", "abcxyz_", "abcmnop_", "abcdef_", "abcxyz", "abcmnop_", "dabcdef_"])