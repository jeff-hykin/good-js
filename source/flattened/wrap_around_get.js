/**
 * wrapAroundGet
 *
 * @example
 * ```js
 *     const items = [9,5,3]
 *     wrapAroundGet(0,items) // 9
 *     wrapAroundGet(1,items) // 5
 *     wrapAroundGet(2,items) // 3
 *     wrapAroundGet(3,items) // 9
 *     wrapAroundGet(4,items) // 5
 * ```
 */
export const wrapAroundGet = (number, list) => list[((number % list.length) + list.length) % list.length]