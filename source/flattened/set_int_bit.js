export function setIntBit(number, bitIndex, value=1) {
    if (value) {
        return number | (1 << bitIndex)
    } else {
        return ~(~number | (1 << bitIndex))
    }
}