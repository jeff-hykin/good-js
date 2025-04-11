
import { normalizePathPosix } from "./normalize_path_posix.js"
import { normalizePathWindows } from "./normalize_path_windows.js"

export function normalizePath(path, { fsType="posix", keepTrailingSlash=false, }={}) {
    if (fsType == "posix") {
        const output = normalizePathPosix(path)
        if (keepTrailingSlash) {
            return output
        }
        // remove trailing slash
        return output[output.length-1] == "/" ? output.slice(0, -1) : output
    } else if (fsType == "windows") {
        return normalizePathWindows(path)
    } else {
        throw Error(`Unsupported fsType: ${fsType}, supported values are "posix" and "windows"`)
    }
}