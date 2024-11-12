
import { normalizePathPosix } from "./normalize_path_posix.js"
import { normalizePathWindows } from "./normalize_path_windows.js"

export function normalizePath(path, { fsType="posix"  }={}) {
    if (fsType == "posix") {
        return normalizePathPosix(path)
    } else if (fsType == "windows") {
        return normalizePathWindows(path)
    } else {
        throw Error(`Unsupported fsType: ${fsType}, supported values are "posix" and "windows"`)
    }
}