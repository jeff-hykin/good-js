const hashString = ()=>0 // TODO

const deepSortObject = (obj, seen=new Map()) => {
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

const stableStringify = (value, ...args) => {
    return JSON.stringify(deepSortObject(value), ...args)
}

const isPrimitive = (value) => {} // FIXME
const isSymbol = (value) => {} // FIXME
const isString = (value) => {} // FIXME
const isPureObject = (value) => {} // FIXME

const unresolved = Symbol("Unresolved")
const addressToHash = new Map()

// NOTE: this fails on the edgecase of unordered sets that contain references to parent elements (backrefs)
// NOTE: it also treats the order of keys as relevent within objects so two objects with the same keys/values but different order will have different hashes
const hashOuter = (value) => {
    const softlinks = []
    const valueRanks = new Map()
    const hashInner = (value, seen=new Map(), path=[], rootValue) => {
        class SoftLink {
            constructor(value) {
                softlinks.push(this)
                this.targetValue = value
                if (valueRanks.has(value)) {
                    const { rank, count } = valueRanks.get(value)
                    valueRanks.set(value, { rank, count: count+1 })
                } else {
                    valueRanks.set(value, { rank: softlinks.length, count: 1 })
                }
            }
            resolved() {
                const rankValue = valueRanks.get(value)
                return hashString(`ref:${rankValue}`)
            }
        }
        
        if (isPrimitive(value)) {
            if (isSymbol(value)) {
                if (addressToHash.has(value)) {
                    return addressToHash.get(value)
                } else {
                    const corrispondingHash = hashString(`symbol:${Math.random()}`)
                    addressToHash.set(value, corrispondingHash)
                    return corrispondingHash
                }
            } else {
                return isString(value) ? hashString(`string:${value}`) : hashString(`primitive:${value}`)
            }
        } else {
            // if its a backreference, then make it a backref
            if (seen.has(value)) {
                const hashValue = seen.get(value)
                // if already resolved, don't make a softlink
                if (typeof hashValue == 'string') {
                    return hashValue
                } else {
                    return new SoftLink(value)
                }
            } else {
                seen.set(value, unresolved)
                let output
                if (isPureObject(value)) {
                    const newObject = {}
                    let resolvable = true
                    // FIXME: get symbol keys (entries() does not)
                    for (const [key, subValue] of Object.entries(value)) {
                        const newKey = hashInner(key)
                        const newValue = hashInner(subValue)
                        if (typeof newValue != 'string') {
                            resolvable = false
                        }
                        newObject[newKey] = newValue
                    }
                    if (resolvable) {
                        output = hashString(`obj:${stableStringify(newObject)}`)
                    } else {
                        output = newObject
                    }
                } else if (value instanceof Array) {
                    const newArray = []
                    let resolvable = true
                    for (const each of value) {
                        const newValue = hashInner(each)
                        if (typeof newValue != 'string') {
                            resolvable = false
                        }
                        newArray.push(newValue)
                    }
                    if (resolvable) {
                        output = hashString(`array:${stableStringify(newArray)}`)
                    } else {
                        output = newArray
                    }
                } else if (value instanceof Map) {
                    const newMap = []
                    let resolvable = true
                    for (const [eachKey, eachValue] of value.entries()) {
                        const newKey = hashInner(key)
                        const newValue = hashInner(subValue)
                        if (typeof newKey != 'string') {
                            resolvable = false
                        }
                        if (typeof newValue != 'string') {
                            resolvable = false
                        }
                        newMap.push([ newKey, newValue ])
                    }
                    if (resolvable) {
                        const mapAsObject = {}
                        for (const [key, subValue] of newMap) {
                            mapAsObject[key] = subValue
                        }
                        output = hashString(`map:${stableStringify(mapAsObject)}`)
                    } else {
                        output = new Map(newMap)
                    }
                } else if (value instanceof Set) {
                    const newSet = []
                    let resolvable = true
                    for (const each of value) {
                        const newValue = hashInner(each)
                        if (typeof newValue != 'string') {
                            resolvable = false
                        }
                        newSet.push(each)
                    }
                    if (resolvable) {
                        newSet.sort()
                        output = hashString(`set:${stableStringify(newSet)}`)
                    } else {
                        output = new Set(newSet)
                    }
                // treat the same as symbols
                } else {
                    if (addressToHash.has(value)) {
                        output = addressToHash.get(value)
                    } else {
                        const corrispondingHash = hashString(`address:${Math.random()}`)
                        addressToHash.set(value, corrispondingHash)
                        output = corrispondingHash
                    }
                }
                seen.set(value, output)
                return output
            }
            
        }
    }


    const stringOrObject = hashInner(value)
    if (typeof stringOrObject == 'string') {
        return stringOrObject
    } else {
        const secondHash = (value)=>{
            if (value instanceof SoftLink) {
                return value.resolved
            } else if (typeof value == 'string') {
                return value
            } else {
                if (isPureObject(value)) {
                    const newObject = {}
                    // FIXME: get symbol keys (entries() does not)
                    for (const [key, subValue] of Object.entries(value)) {
                        const newValue = secondHash(subValue)
                        newObject[newKey] = newValue
                    }
                    return hashString(`obj:${stableStringify(newObject)}`)
                } else if (value instanceof Array) {
                    const newArray = value.map(each=>secondHash(each))
                    return hashString(`array:${stableStringify(newArray)}`)
                } else if (value instanceof Map) {
                    const mapAsObject = {}
                    for (const [eachKey, eachValue] of value.entries()) {
                        const newKey = secondHash(key)
                        const newValue = secondHash(subValue)
                        mapAsObject[newKey] = newValue
                    }
                    return hashString(`map:${stableStringify(mapAsObject)}`)
                } else if (value instanceof Set) {
                    const newSet = [...value].map(each=>secondHash(each))
                    newSet.sort()
                    return hashString(`set:${stableStringify(newSet)}`)
                } else {
                    throw Error(`IDK how you got here, secondHash(value:${value})`)
                }
            }
        }
        return secondHash(value)
    }
} 