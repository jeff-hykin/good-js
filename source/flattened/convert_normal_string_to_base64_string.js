import { convertUint8ArrayToBase64String } from "./convert_uint8_array_to_base64_string.js"

export function convertNormalStringToBase64String(str, encoder=new TextEncoder()) {
	return convertUint8ArrayToBase64String(encoder.encode(str))
}