import { convertUint8ArrayToBase64String as bytesToBase64 } from "./convert_uint8_array_to_base64_string.js"

export function convertNormalStringToBase64String(str, encoder = new TextEncoder()) {
	return decoder.decode(base64ToBytes(str))
}