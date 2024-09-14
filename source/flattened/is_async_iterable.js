export const isAsyncIterable = function(value) {
    return value != null && typeof value[Symbol.asyncIterator] === 'function'
}