export const isSyncIterable = function(value) {
        return value && typeof value[Symbol.iterator] === 'function'
    }