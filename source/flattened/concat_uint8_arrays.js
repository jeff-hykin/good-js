export function concatUint8Arrays(arrays) {
    // Calculate the total length of the concatenated array
    let totalLength = 0
    for (const arr of arrays) {
        totalLength += arr.length
    }

    // Create a new Uint8Array with the total length
    const result = new Uint8Array(totalLength)

    // Copy the elements from each source array into the result array
    let offset = 0
    for (const arr of arrays) {
        result.set(arr, offset)
        offset += arr.length
    }

    return result
}