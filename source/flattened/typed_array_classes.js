export const typedArrayClasses = [
    Uint16Array,
    Uint32Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Int32Array,
    Int8Array,
    Float32Array,
    Float64Array,
]
if (globalThis.BigInt64Array) {
    typedArrayClasses.push(globalThis.BigInt64Array)
}
if (globalThis.BigUint64Array) {
    typedArrayClasses.push(globalThis.BigUint64Array)
}