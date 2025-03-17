/**
 * Selects a random element from an array and returns both the element and its index.
 *
 * @example
 * ```js
 * const arr = [1, 2, 3, 4, 5]
 * const { index, element } = randomSelectElementAndIndex(arr)
 * console.log(index) // 0, 1, 2, 3, 4
 * console.log(element) // 1, 2, 3, 4, 5
 * ```
 *
 * @param {Array} arr - The array from which to select the random element.
 * @returns {Object} An object containing the random element and its index.
 *   @property {number} index - The index of the randomly selected element.
 *   @property {*} element - The randomly selected element from the array.
 */
export function randomSelectElementAndIndex(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    const element = arr[randomIndex]
    return { index: randomIndex, element: element }
}