export function setIntBitTrue(number, bitIndex) {
    return number | (1 << bitIndex)
}