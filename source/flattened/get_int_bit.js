export function getIntBit(number, bitIndex) {
    return number >> bitIndex & 1
}