const textEncoder = new TextEncoder('utf-8')
export const stringToUtf8Bytes = textEncoder.encode.bind(textEncoder)