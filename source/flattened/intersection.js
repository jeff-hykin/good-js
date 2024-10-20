/**
 * set intersection
 *
 * @example
 * ```js
 *     // new Set([1])
 *     intersection(new Set([1,2,3]), new Set([1,]), new Set([1,2,]))
 * ```
 */
export function intersection(...sets) {
    const sortedSets = sets.sort((a,b)=>((a.size || a.length || 0) - (b.size || b.length || 0)))
    const smallestCopy = new Set(sortedSets.shift())
    // each of sortedSets (the first was removed)
    for (const eachSet of sortedSets) {
        if (smallestCopy.size == 0) {
            break
        } else {
            for (const eachCommonElement of smallestCopy) {
                if (!eachSet.has(eachCommonElement)) {
                    smallestCopy.delete(eachCommonElement)
                }
            }
        }
    }
    return smallestCopy
}
