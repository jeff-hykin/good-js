export function *subtractIter({value, from}) {
    // modified from: https://stackoverflow.com/questions/1723168/what-is-the-fastest-or-most-elegant-way-to-compute-a-set-difference-using-javasc
    const setA = new Set([...from])
    const setB = new Set([...value])

    for (const v of setB.values()) {
        if (!setA.delete(v)) {
            yield v
        }
    }

    for (const v of setA.values()) {
        yield v
    }
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
