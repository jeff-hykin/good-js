/**
 * Fast All-Same-Element checker
 *
 * @example
 * ```js
 * allEqual([1,2,1,1,1]) // false
 * allEqual([1,1,1,1,1]) // true
 * ```
 *
 * @returns {boolean} output
 *
 */
export function allEqual(anIterable) {
    // looks weird but the outer for loop only inits the prev
    // its done this way to both be generic (any iterator) and optimal (no if(firstElement) check or .length check)
    for (let prev of anIterable) {
        for (const each of anIterable) {
            if (each!==prev) {
                return false
            }
            prev = each
        }
        break
    }
    return true
}