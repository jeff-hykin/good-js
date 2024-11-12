import { _base64NumericCodes as base64codes } from "./_base64_numeric_codes.js"
import { base64Letters as base64abc } from "./base64_letters.js"

export function _getBase64Code(charCode) {
	if (charCode >= base64codes.length) {
		throw new Error("Unable to parse base64 string.");
	}
	const code = base64codes[charCode];
	if (code === 255) {
		throw new Error("Unable to parse base64 string.");
	}
	return code;
}