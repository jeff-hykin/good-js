/**
 *
 * mountedToDom
 *
 *
 * @param {HTMLElement} element - which should be a
 * @return {Promise} 
 *
 * @example
 *     mountedToDom(element).then(() => console.log("mounted"))
 */
const mountedToDom = async (element) => {
    // if already on the dom
    if (element.isConnected) {
        return
    }
    // else wait on it getting added
    return new Promise((resolve, reject) => {
        if (mountedToDom.elementsBeingWatched.has(element)) {
            mountedToDom.elementsBeingWatched.get(element).push(resolve)
        } else {
            mountedToDom.elementsBeingWatched.set(element, [resolve])
        }
    })
}
mountedToDom.elementsBeingWatched = new Map()
mountedToDom.pollingRate = 350 // miliseconds
// mounted checker (keep outside of function for efficiency reasons)
setInterval(() => {
    for (const [element, resolvers] of mountedToDom.elementsBeingWatched.entries()) {
        // if connected, run callbacks, and remove listener
        if (element.isConnected) {
            for (let eachResolver of resolvers) {
                eachResolver()
            }
            mountedToDom.elementsBeingWatched.delete(element)
        }
    }
}, mountedToDom.pollingRate)

//
// hash
//
const hash = (object) => JSON.stringify(object).split("").reduce(
    (hashCode, currentVal) => (hashCode = currentVal.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode),
    0
)

//
// wrapAroundGet
//
const wrapAroundGet = (number, list) => list[(number % list.length + list.length) % list.length]

// 
// sum
// 
const sum = (list) => list.reduce((a, b) => (a-0) + (b-0), 0)

// 
// numbers
// 
const numbers = ({count, min, max, decimals=5}) => {
    const range = max-min
    const increment = range / count
    const values = [ min.toFixed(decimals)-0 ]
    let index = 0
    const valueAt = (index) => min + (increment * index)
    while (valueAt(index) < max) {
        values.push(valueAt(index++).toFixed(decimals)-0)
    }
    values.push(max.toFixed(decimals)-0)
    return values
}

// 
// stats
// 
/**
 * @param {Array} listOfNumbers - yup
 * @return {Array} [min,max,range,average,median,sum]
 *
 * @example
 *     const [min,max,range,average,median,sum] = stats([1,50352,3,4,5555234])
 */
const stats = (listOfNumbers) => {
    const median = listOfNumbers[Math.floor(listOfNumbers.length/2)]
    let min=Infinity, max=-Infinity, sum=0
    for (const each of listOfNumbers) {
        sum += each
        if (each > max) {
            max = each
        }
        if (each < min) {
            min = each
        }
    }
    return [ min, max, max-min, sum/listOfNumbers.length, median, sum ]
}

// 
// Array to object keys
// 
const arrayAsObjectKeys = (array, defaultValue)=>array.reduce((acc,curr)=> (acc[curr]=defaultValue,acc),{})


// 
// Linear Mapping
// 
const createLinearMapper = (from={min:0, max:1}, to={min:0, max:100})=> {
    const fromRange = from.max - from.min
    const toRange = to.max - to.min
    return (value) => {
        const normalized = (value - from.min)/fromRange
        const newMapping = (normalized * toRange) + to.min
        return newMapping
    }
}


//
//
// exports
//
//
module.exports = {
    mountedToDom,
    wrapAroundGet,
    hash,
    getFrequencies,
    numbers,
    sum,
    stats,
    createLinearMapper,
    arrayAsObjectKeys,
}
