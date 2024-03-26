import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { withoutCommonSuffix } from "../flattened/without_common_suffix.js"

console.log();testCallJsonify(withoutCommonSuffix, [])
console.log();testCallJsonify(withoutCommonSuffix, ["cdef", "abcxyz", "abcmnop"])
console.log();testCallJsonify(withoutCommonSuffix, ["cdef", "cdef", "cdef"])
console.log();testCallJsonify(withoutCommonSuffix, ["abcdefnop", "abcxyznop", "abcmnop", "abcdefnop"])
console.log();testCallJsonify(withoutCommonSuffix, ["abcdef", "abcxyz", "aabcmnop", "abcdef", "abcxyz"])
console.log();testCallJsonify(withoutCommonSuffix, ["abcdef", "abcxyzf", "abcmnopf", "abcdef", "abcxyzf", "abcmnopf"])
console.log();testCallJsonify(withoutCommonSuffix, ["abcdef", "abcxyz", "abcmnop", "abcdef", "abcxyz", "abcmnop", "dabcdef"])
console.log();testCallJsonify(withoutCommonSuffix, ["abcdef"])
