/**
 * Permutations
 *
 * @example
 * ```js
 *     [...permute([1,2,3])]
 *     // [[1,2,3],[2,1,3],[3,1,2],[1,3,2],[2,3,1],[3,2,1]]
 * ```
 */
export const permute = function* (elements) {
    yield elements.slice()
    const length = elements.length
    const c = new Array(length).fill(0)
    let i = 1,
        k,
        p

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i]
            p = elements[i]
            elements[i] = elements[k]
            elements[k] = p
            ++c[i]
            i = 1
            yield elements.slice()
        } else {
            c[i] = 0
            ++i
        }
    }
}