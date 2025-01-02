import { pathPiecesPosix } from "./path_pieces_posix.js"
import { pathPiecesWindows } from "./path_pieces_windows.js"

/**
 * @example
 * ```js
 * const [ folders, itemName, itemExtensionWithDot ] = pathPiecesPosix(`/Users/me/Documents/myFolder/myFile.txt`)
 * ```
 */
export function pathPieces(path, { fsType="posix" } = {}) {
    if (fsType == "posix") {
        return pathPiecesPosix(path)
    } else if (fsType == "windows") {
        return pathPiecesWindows(path)
    } else {
        throw Error(`Unsupported fsType: ${fsType}, supported values are "posix" and "windows"`)
    }
}