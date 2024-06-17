/**
 * isPrimitive
 *
 * @param value - any value
 * @example
 * ```js
 *     // true
 *     isPrimitive(BigInt("1"))
 *     isPrimitive("1")        
 *     isPrimitive(null)
 *     isPrimitive(NaN)
 *     isPrimitive(Symbol("hi"))
 *     
 *     // false
 *     isPrimitive(new RegExp())
 *     isPrimitive(new Date())
 *     isPrimitive({})
 * ```
 */
export const isPrimitive = (value)=>!(value instanceof Object)