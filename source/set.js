export function* subtractIter({value, from}) {
    // modified from: https://stackoverflow.com/questions/1723168/what-is-the-fastest-or-most-elegant-way-to-compute-a-set-difference-using-javasc
    const setA = new Set([...from])
    if (value instanceof Set) {
        for (const eachValue of value) {
            // if was not in A, remove it
            if (!setA.delete(eachValue)) {
                yield eachValue
            }
        }
    } else {
        const alreadyYielded = new Set()
        for (const eachValue of value) {
            // if was not in A, remove it
            if (!setA.delete(eachValue)) {
                if (!alreadyYielded.has(eachValue)) {
                    yield eachValue
                    alreadyYielded.add(eachValue)
                }
            }
        }
    }
    
    // everything remaining in setA is not in "value"
    yield* setA
}

export function subtract({value, from}) {
    return new Set(subtractIter({value, from}))
}

export function intersection(...sets) {
    const sortedSets = sets.sort((a,b)=>(a.length - b.length))
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
