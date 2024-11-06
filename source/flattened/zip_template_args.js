/**
 * make template functions easier
 *
 * @example
 * ```js
 * import { zipTemplateArgs } from '../flattened/zip_template_args.js'
 * 
 * function yourTemplateFunc(...args) {
 *     const zippedArgs = zipTemplateArgs(args)
 *     zippedArgs.map(each=>each instanceof Array ? JSON.stringify(each) : each)
 *     return zippedArgs.join("")
 * }
 * 
 * // both behave the same
 * yourTemplateFunc`hello ${["world", "bob"]}`
 * yourTemplateFunc(`hello `, ["world", "bob"])
 * ```
 */
export function zipTemplateArgs(maybeStrings, ...args) {
    let asStringArg
    const isTemplateCallProbably = maybeStrings instanceof Array && maybeStrings.length-1 == args.length
    let zippedArgs = []
    if (isTemplateCallProbably) {
        let index = -1
        for (const each of args) {
            index++
            zippedArgs.push(maybeStrings[index])
            // here's where to handle custom logic on interpolated args
            zippedArgs.push(each)
        }
        zippedArgs.push(maybeStrings[index+1])
    } else {
        zippedArgs = [maybeStrings, ...args]
    }
    return zippedArgs
}