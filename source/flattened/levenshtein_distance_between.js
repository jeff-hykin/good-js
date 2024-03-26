/**
 * Calculates the Levenshtein distance between two strings.
 *
 * @param {string} str1 - The first string.
 * @param {string} str2 - The second string.
 * @returns {number} The Levenshtein distance between the two strings.
 */
export function levenshteinDistanceBetween(str1, str2) {
    if (str1.length > str2.length) {
        ;[str1, str2] = [str2, str1]
    }

    let distances = Array.from({ length: str1.length + 1 }, (_, i) => +i)
    for (let str2Index = 0; str2Index < str2.length; str2Index++) {
        const tempDistances = [str2Index + 1]
        for (let str1Index = 0; str1Index < str1.length; str1Index++) {
            let char1 = str1[str1Index]
            let char2 = str2[str2Index]
            if (char1 === char2) {
                tempDistances.push(distances[str1Index])
            } else {
                tempDistances.push(1 + Math.min(distances[str1Index], distances[str1Index + 1], tempDistances[tempDistances.length - 1]))
            }
        }
        distances = tempDistances
    }
    return distances[distances.length - 1]
}