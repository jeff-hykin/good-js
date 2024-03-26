import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { withoutCommonPrefix } from "../flattened/without_common_prefix.js"

console.log();testCallJsonify(withoutCommonPrefix, [])
console.log();testCallJsonify(withoutCommonPrefix, ["cdef", "abcxyz", "abcmnop"])
console.log();testCallJsonify(withoutCommonPrefix, ["cdef", "cdef", "cdef"])
console.log();testCallJsonify(withoutCommonPrefix, ["abcdef", "abcxyz", "abcmnop", "abcdef"])
console.log();testCallJsonify(withoutCommonPrefix, ["abcdef", "abcxyz", "aabcmnop", "abcdef", "abcxyz"])
console.log();testCallJsonify(withoutCommonPrefix, ["abcdef", "abcxyz", "abcmnop", "abcdef", "abcxyz", "abcmnop"])
console.log();testCallJsonify(withoutCommonPrefix, ["abcdef", "abcxyz", "abcmnop", "abcdef", "abcxyz", "abcmnop", "dabcdef"])