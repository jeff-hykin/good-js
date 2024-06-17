export const deepSortObject = (obj, seen=new Map()) => {
    if (!(obj instanceof Object)) {
        return obj
    } else if (seen.has(obj)) {
        // return the being-sorted object
        return seen.get(obj)
    } else {
        if (obj instanceof Array) {
            const sortedChildren = []
            seen.set(obj, sortedChildren)
            for (const each of obj) {
                sortedChildren.push(deepSortObject(each, seen))
            }
            return sortedChildren
        } else {
            const sorted = {}
            seen.set(obj, sorted)
            for (const eachKey of Object.keys(obj).sort()) {
                sorted[eachKey] = deepSortObject(obj[eachKey], seen)
            }
            return sorted
        }
    }
}