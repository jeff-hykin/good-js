export const isSyncIterable = function(value) {
    return value != null && typeof value[Symbol.iterator] === 'function'
}