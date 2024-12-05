import { convertUint8ArrayToBase64String } from "./convert_uint8_array_to_base64_string.js"

/**
 * @example
 * ```js
 * console.log(convertNormalStringToBase64String("echo howdy"))
 * ```
 */
export function convertNormalStringToBase64String(str, encoder=new TextEncoder()) {
	return convertUint8ArrayToBase64String(encoder.encode(str))
}