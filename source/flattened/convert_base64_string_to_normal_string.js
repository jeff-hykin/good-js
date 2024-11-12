import { convertBase64StringToUint8Array as bytesToBase64 } from "./convert_base64_string_to_uint8_array.js"

export function base64StringToNormalString(str, encoder = new TextEncoder()) {
	return bytesToBase64(encoder.encode(str))
}