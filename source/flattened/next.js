import { stop } from "./stop_symbol.js"
const handleResult = ({value, done})=>done?stop:value

/**
 * next
 *
 * @param object - an iterator/generator (needs a next method)
 * @returns {stop|any} output - will either be the stop symbol or will be the next value
 *
 * @example
 * ```js
 *     import { iter, next, stop } from "https://deno.land/x/good/iterable.js"
 *     // Note: works on async iterators, and returns promises in that case
 *     const iterable = iter([1,2,3])
 *     next(iterable) // 1
 *     next(iterable) // 2
 *     next(iterable) // 3
 *     next(iterable) == stop // true
 * ```
 */
export const next = (object)=>{
    if (object.next instanceof Function) {
        const result = object.next()
        if (result instanceof Promise) {
            return result.then(handleResult)
        } else {
            return handleResult(result)
        }
    } else {
        throw Error(`can't call next(object) on the following object as there is no object.next() method`, object)
    }
}