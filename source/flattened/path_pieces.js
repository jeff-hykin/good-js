import { pathPiecesPosix } from "./path_pieces_posix.js"
import { pathPiecesWindows } from "./path_pieces_windows.js"

export function pathPieces(path, { fsType="posix" } = {}) {
    if (fsType == "posix") {
        return pathPiecesPosix(path)
    } else if (fsType == "windows") {
        return pathPiecesWindows(path)
    } else {
        throw Error(`Unsupported fsType: ${fsType}, supported values are "posix" and "windows"`)
    }
}