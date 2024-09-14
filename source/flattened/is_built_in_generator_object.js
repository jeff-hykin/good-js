import { isBuiltInAsyncIterator } from "./is_built_in_async_iterator.js"
import { isBuiltInSyncIterator } from "./is_built_in_sync_iterator.js"

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
export const isBuiltInGeneratorObject = (value) => isIterator(value) && (isBuiltInSyncIterator(value) || isBuiltInAsyncIterator(value))