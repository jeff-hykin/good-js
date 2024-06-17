export const isAsyncIterable = function(value) {
        return value && typeof value[Symbol.asyncIterator] === 'function'
    }