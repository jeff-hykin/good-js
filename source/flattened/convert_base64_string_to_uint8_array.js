import { _base64NumericCodes as base64codes } from "./_base64_numeric_codes.js"
import { base64Letters as base64abc } from "./base64_letters.js"
import { _getBase64Code as getBase64Code } from "./_get_base64_code.js"

/**
 * @example
 * ```js
 * console.log(convertBase64StringToUint8Array("ZWNobyBob3dkeQ=="))
 * ```
 */
export function convertBase64StringToUint8Array(str) {
	if (str.length % 4 !== 0) {
		throw new Error("Unable to parse base64 string.");
	}
	const index = str.indexOf("=");
	if (index !== -1 && index < str.length - 2) {
		throw new Error("Unable to parse base64 string.");
	}
	let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0,
		n = str.length,
		result = new Uint8Array(3 * (n / 4)),
		buffer;
	for (let i = 0, j = 0; i < n; i += 4, j += 3) {
		buffer =
			getBase64Code(str.charCodeAt(i)) << 18 |
			getBase64Code(str.charCodeAt(i + 1)) << 12 |
			getBase64Code(str.charCodeAt(i + 2)) << 6 |
			getBase64Code(str.charCodeAt(i + 3));
		result[j] = buffer >> 16;
		result[j + 1] = (buffer >> 8) & 0xFF;
		result[j + 2] = buffer & 0xFF;
	}
	return result.subarray(0, result.length - missingOctets);
}