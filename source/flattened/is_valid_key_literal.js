import { isValidIdentifier } from "./is_valid_identifier.js"

export function isValidKeyLiteral(value) {
    if (typeof value != 'string') {
        return false
    }
    // simple key, covers all keywords
    if (value.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
        return true
    }
    // covers more advanced cases, like emojis
    return isValidIdentifier(value)
}