import { basename } from "../support/posix.js"
const Path = {basename}

/**
 * @example
 * ```js
 * const pureName = pathPureName(`/Users/me/Documents/myFolder/myFile.1.txt`)
 * console.log(pureName) // "myFile.1"
 * ```
 */
export function pathPureName(path) {
    const items = Path.basename(path?.path||path).split(".")
    if (items.length == 1) {
        return items[0]
    } else {
        return items.slice(0,-1)
    }
}