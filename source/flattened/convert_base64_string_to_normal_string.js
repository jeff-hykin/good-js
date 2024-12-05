import { convertBase64StringToUint8Array } from "./convert_base64_string_to_uint8_array.js"

/**
 * @example
 * ```js
 * console.log(base64StringToNormalString("ZWNobyBob3dkeQ=="))
 * ```
 */
export function base64StringToNormalString(str, decoder=new TextDecoder()) {
	return decoder.decode(convertBase64StringToUint8Array(str))
}