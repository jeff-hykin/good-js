import { isPrimitive } from "./is_primitive.js"
/**
 * isPracticallyPrimitive
 *
 * @param value - any value
 * @example
 * ```js
 *     // false
 *     isPracticallyPrimitive({})
 *     isPracticallyPrimitive([])
 *     class A {}
 *     isPracticallyPrimitive(new A)
 *     
 *     // true
 *     isPracticallyPrimitive(new Date())
 *     isPracticallyPrimitive(new RegExp())
 *     class D extends Date {}
 *     isPracticallyPrimitive(new D())
 * ```
 */
export const isPracticallyPrimitive = (value)=>isPrimitive(value) || value instanceof Date || value instanceof RegExp || value instanceof URL