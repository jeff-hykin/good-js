import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { commonSuffix } from "../flattened/common_suffix.js"

testCallJsonify(commonSuffix, [])
testCallJsonify(commonSuffix, ["aac", "adbc", "abc"])
testCallJsonify(commonSuffix, ["ab", "ab", "abc"])
testCallJsonify(commonSuffix, ["ab", "ab", "ab"])
testCallJsonify(commonSuffix, ["aldjfaldkjaaa", "abaaa", "abcaaa"])
testCallJsonify(commonSuffix, ["adfadsc", "abc", "abc"])
testCallJsonify(commonSuffix, ["edfadsc", "abc", "abc"])