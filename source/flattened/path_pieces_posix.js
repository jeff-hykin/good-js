import { parse, basename, dirname } from "../support/posix.js"
const Path = {parse,basename,dirname}

/**
 * @example
 * ```js
 * const [ folders, itemName, itemExtensionWithDot ] = pathPiecesPosix(`/Users/me/Documents/myFolder/myFile.txt`)
 * console.debug(`folders is:`,folders) // [ "/", "Users", "me", "Documents", "myFolder" ]
 * console.debug(`itemName is:`,itemName) // "myFile"
 * console.debug(`itemExtensionWithDot is:`,itemExtensionWithDot) // ".txt"
 * ```
 */
export function pathPiecesPosix(path) {
    // const [ folders, itemName, itemExtensionWithDot ] = FileSystem.pathPieces(path)
    path = (path.path || path) // if given PathInfo object
    const result = Path.parse(path)
    const folderList = []
    let dirname = result.dir
    while (true) {
        folderList.push(Path.basename(dirname))
        // if at the top 
        if (dirname == Path.dirname(dirname)) {
            break
        }
        dirname = Path.dirname(dirname)
    }
    folderList.reverse()
    if (folderList[0] == "") {
        folderList[0] = "/"
    }
    return [ folderList, result.name, result.ext ]
}