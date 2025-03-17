/**
 * Selects a random element from an array and returns both the element and its index.
 *
 * @example
 * ```js
 * const arr = [1, 2, 3, 4, 5]
 * console.log(randomSelectElement(arr))
 * ```
 *
 * @param {Array} arr - The array from which to select the random element.
 */
export function randomSelectElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}