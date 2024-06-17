export const isTechnicallyIterable = function(value) {
        return value instanceof Object || typeof value == 'string'
    }