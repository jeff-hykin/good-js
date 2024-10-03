/**
 * import same module twice (Jupyter)
 *
 * @example
 * ```js
 *     import { load } from './load.js'
 *     Deno.writeTextFileSync('test.js', "console.log('hello')")
 *     await load('test.js') // "hello"
 *     Deno.writeTextFileSync('test.js', "console.log('hello world')")
 *     await load('test.js') // "hello world"
 * ```
 * @param {String} path - description
 */
export const load = (path, other)=>import(`${path}#${Math.random()}`, other)