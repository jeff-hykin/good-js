import { isBuiltInIterator } from "./is_built_in_iterator.js"
export const isGeneratorType = (value) => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
        if (value instanceof Object) {
            // all builtin interators are also generators
            if (isBuiltInIterator(value)) {
                return true
            }
            const constructor = value.constructor
            return constructor == SyncGenerator || constructor == AsyncGenerator
        }
        return false
    }