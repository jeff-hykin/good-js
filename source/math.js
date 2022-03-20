// 
// stats
// 
/**
 * @param {Array} listOfNumbers - yup
 * @return {Object} {min,max,range,average,median,sum}
 *
 * @example
 *     const { min,max,range,average,median,sum } = stats([1,50352,3,4,5555234])
 */
export const stats = (listOfNumbers) => {
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
    return {
        min,
        max,
        range: max-min,
        average: sum/listOfNumbers.length,
        median: median,
        sum: sum,
    }
}

export const sum = (list) => list.reduce((a, b) => (a-0) + (b-0), 0)

// 
// spread
// 
/**
 * @param {Object} 
 * @return {Array} values evenly distributed between min/max (length=quantity)
 *
 * @example
 *     const values = spread({ quantity: 10, min: 1.37, max: 7.86 })
 */
export const spread = ({quantity, min, max, decimals=5}) => {
    const range = max-min
    const increment = range / quantity
    const values = [ min.toFixed(decimals)-0 ]
    let index = 0
    const valueAt = (index) => min + (increment * index)
    while (valueAt(index) < max) {
        values.push(valueAt(index++).toFixed(decimals)-0)
    }
    values.push(max.toFixed(decimals)-0)
    return values
}

// TODO: jsdoc example
// TODO: function could be more efficient (distrubte the /fromRange)
export const createLinearMapper = (from={min:0, max:1}, to={min:0, max:100})=> {
    const fromRange = from.max - from.min
    const toRange = to.max - to.min
    return (value) => {
        const normalized = (value - from.min)/fromRange
        const newMapping = (normalized * toRange) + to.min
        return newMapping
    }
}