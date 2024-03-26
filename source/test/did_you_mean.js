import { testCallJsonify } from "../flattened/test_call_jsonify.js"
import { didYouMean } from "../flattened/did_you_mean.js"

testCallJsonify(didYouMean, { givenWord: "hep", possibleWords: ["help", "size", "blah", "length",], autoThrow: true })
testCallJsonify(didYouMean, { givenWord: "help", possibleWords: ["help", "size", "blah", "length",], autoThrow: true })

