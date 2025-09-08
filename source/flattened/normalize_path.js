
import { normalizePathPosix } from "./normalize_path_posix.js"
import { normalizePathWindows } from "./normalize_path_windows.js"
import { isAbsolute as isAbsoluteWindows } from "../support/windows.js"

export function normalizePath(path, { fsType="posix", keepTrailingSlash=false, forcePrefix=false }={}) {
    let output
    if (fsType == "posix") {
        output = normalizePathPosix(path)
        // e.g. not: absolute path or "./" "../" "." ".."
        if (forcePrefix&&!output.match(/^(\/|\.\.?(?:\/|$))/)) {
            output = `./${output}`
        }
        if (keepTrailingSlash) {
            return output
        }
        // remove trailing slash
        output = output[output.length-1] == "/" ? output.slice(0, -1) : output
    } else if (fsType == "windows") {
        output = normalizePathWindows(path)
        // e.g. not: absolute path or stuff like "./" "../" "..\" "." ".."
        if (forcePrefix&&!isAbsoluteWindows(path)&&!output.match(/^\.\.?(?:\/|\\|$)/)) {
            output = `./${output}`
        }
        if (keepTrailingSlash) {
            return output
        }
        // remove trailing slash
        const lastChar = output[output.length-1]
        output = lastChar == "/" || lastChar == "\\" ? output.slice(0, -1) : output
    } else {
        throw Error(`Unsupported fsType: ${fsType}, supported values are "posix" and "windows"`)
    }
    return output
}