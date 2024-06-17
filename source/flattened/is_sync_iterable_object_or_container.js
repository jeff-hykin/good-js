/**
     * isSyncIterableObjectOrContainer
     *
     * @param value - any value
     * @returns {Boolean} output - whether or not people would call this object an iterable
     *
     * @example
     * ```js
     *     // false
     *     isSyncIterableObjectOrContainer("adfsad")
     *     isSyncIterableObjectOrContainer({a:1})
     *     isSyncIterableObjectOrContainer(null)
     * 
     *     // true
     *     isSyncIterableObjectOrContainer([])
     *     isSyncIterableObjectOrContainer(new Set())
     *     isSyncIterableObjectOrContainer(new Map())
     *     class A { *[Symbol.iterator]() { yield* [1,2,3] } }
     *     isSyncIterableObjectOrContainer(new A())
     * ```
     */
    export const isSyncIterableObjectOrContainer = function(value) {
        return value instanceof Object && typeof value[Symbol.iterator] == 'function'
    }