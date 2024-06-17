    /**
     * isPureObject
     *
     * @param value - any value
     * @example
     * ```js
     *     // false
     *     isPureObject(new RegExp())
     *     isPureObject([])
     *     class A {}
     *     isPureObject(new A)
     *     
     *     // true
     *     isPureObject({})
     * ```
     */
    export const isPureObject = (value)=>(value instanceof Object)&&Object.getPrototypeOf(value).constructor == Object