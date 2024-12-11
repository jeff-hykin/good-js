import { normalizePathPosix } from "./normalize_path_posix.js"

/**
 * @example
 * ```js
 * // returns true
 * isValidPathStringForFilePosix("/home/user/file.txt")
 * 
 * // returns false
 * isValidPathStringForFilePosix("")
 * isValidPathStringForFilePosix("/home/user/.")
 * isValidPathStringForFilePosix("/")
 * isValidPathStringForFilePosix("..")
 * isValidPathStringForFilePosix("/")
 * ```
 */
export function isValidPathStringForFilePosix(path) {
    // technically this should include: path == "/dev" || path == "/tmp"
    // note: macos bans colon and this doesnt
    return !(typeof path != "string" || path.endsWith("/") || path.length == 0 || path.match(/(^|\/)\.\.?$/) || path.includes("\0") || !isValidPathStringForFilePosix(normalizePathPosix(path)))
}