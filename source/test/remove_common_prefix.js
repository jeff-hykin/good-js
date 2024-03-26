import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { removeCommonPrefix } from "../flattened/remove_common_prefix.js"

console.log();testCallJsonify(removeCommonPrefix, [])
console.log();testCallJsonify(removeCommonPrefix, ["cdef", "abcxyz", "abcmnop"])
console.log();testCallJsonify(removeCommonPrefix, ["cdef", "cdef", "cdef"])
console.log();testCallJsonify(removeCommonPrefix, ["abcdefnop", "abcxyznop", "abcmnop", "abcdefnop"])
console.log();testCallJsonify(removeCommonPrefix, ["abcdef", "abcxyz", "aabcmnop", "abcdef", "abcxyz"])
console.log();testCallJsonify(removeCommonPrefix, ["abcdef", "abcxyzf", "abcmnopf", "abcdef", "abcxyzf", "abcmnopf"])
console.log();testCallJsonify(removeCommonPrefix, ["abcdef", "abcxyz", "abcmnop", "abcdef", "abcxyz", "abcmnop", "dabcdef"])
console.log();testCallJsonify(removeCommonPrefix, ["abcdef"])
