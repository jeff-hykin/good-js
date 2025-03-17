/**
 * will mutate an array to randomly shuffle it
 *
 * @example
 * ```js
 * var a = [1, 2, 3]
 * randomlyShuffle(a) // no return value
 * console.log(a) // [1, 3, 2]
 * ```
 * 
 * @note
 * uses Fisher-Yates algorithm
 */
export function randomlyShuffle(arr) {
    for (let index = arr.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))

        // Swap elements 
        ;[arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]]
    }
}