export function subtract({value, from}) {
    let source = from
    let detractor = value
    // make sure source has a size (but do as little conversion as possible)
    let sourceSize = source.size || source.length
    if (!sourceSize) {
        source = new Set(source)
        sourceSize = source.size
    }
    // make sure detractor has a size (but do as little conversion as possible)
    let detractorSize = detractor.size || detractor.length
    if (!detractorSize) {
        detractor = new Set(detractor)
        detractorSize = detractor.size
    }

    // 
    // source is smaller => iterate over it
    // 
    if (sourceSize < detractorSize) {
        const outputSet = new Set() // required to avoid duplicates (if source is not a set)
        !(detractor instanceof Set) && (detractor=new Set(detractor))
        for (const each of source) {
            // if the detractor wasn't going to remove it, then it belongs in the output
            if (!detractor.has(each)) {
                outputSet.add(each)
            }
        }
        return outputSet
    // 
    // detractor is smaller => iterate over it
    // 
    } else {
        // make sure source is a copy
        !(source != from) && (source=new Set(source))
        // remove all the ones in detractor
        for (const eachValueBeingRemoved of detractor) {
            source.delete(eachValueBeingRemoved)
        }
        return source
    }
}

export function intersection(...sets) {
    const sortedSets = sets.sort((a,b)=>((a.size || a.length) - (b.size || b.length)))
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
