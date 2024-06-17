const textDecoder = new TextDecoder('utf-8')
export const utf8BytesToString = textDecoder.decode.bind(textDecoder)