import { _base64NumericCodes as base64codes } from "./_base64_numeric_codes.js"
import { base64Letters as base64abc } from "./base64_letters.js"

export function uint8ArrayToBase64String(bytes) {
    let result = "",
        i,
        l = bytes.length
    for (i = 2; i < l; i += 3) {
        result += base64abc[bytes[i - 2] >> 2]
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)]
        result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)]
        result += base64abc[bytes[i] & 0x3f]
    }
    if (i === l + 1) {
        // 1 octet yet to write
        result += base64abc[bytes[i - 2] >> 2]
        result += base64abc[(bytes[i - 2] & 0x03) << 4]
        result += "=="
    }
    if (i === l) {
        // 2 octets yet to write
        result += base64abc[bytes[i - 2] >> 2]
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)]
        result += base64abc[(bytes[i - 1] & 0x0f) << 2]
        result += "="
    }
    return result
}
