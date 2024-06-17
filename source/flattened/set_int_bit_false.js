export function setIntBitFalse(number, bitIndex) {
    return ~(~number | (1 << bitIndex))
}