/**
 * aka isIterable (but not a string)
 */
export const isIterableObjectOrContainer = function(value) {
    return value instanceof Object && (typeof value[Symbol.iterator] == 'function' || typeof value[Symbol.asyncIterator] === 'function')
}