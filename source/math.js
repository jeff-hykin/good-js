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
        count: listOfNumbers.length,
    }
}

export const sum = (list) => list.reduce((a, b) => (a-0) + (b-0), 0)
export const product = (list) => list.reduce((a, b) => (a-0) * (b-0), 1)

export const normalizeZeroToOne = (values) => {
    const { min, range } = stats(values)
    // edgecase
    if (range == 0) {
        return values.map(each=>0)
    }
    return values.map(each=>(each-min)/range)
}

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

/**
 * Function that does something
 *
 * @param {"decimal"|"scientific"|"e"|"auto"} args.notation - which format
 * @param {null|Number} args.expectedNumberOfDigits - 
 * @param {"right"|"left"|"center"} args.align - 
 * @param {null|"max"|Number} args.significantFigures - 
 * @return {Boolean} the output is a
 *
 * @example
 *     does something
 */
// export const format = ({ value, base=10, notation="decimal", decimalPlaces=null, significantFigures=null, fillGapsWith=" ", expectedNumberOfDigits=null, align="right", }) => {
//     const numberOrNan = value-0
//     let outputString
//     // if NaN/Infinite/NegativeInfinty
//     if (numberOrNan !== numberOrNan || numberOrNan === Infinity || numberOrNan === -Infinity) {
//         outputString = `${numberOrNan}`
//     } else {
//         const number = numberOrNan
//         const exponent = Math.log(number)/Math.log(base)
//         const log = Math.pow(number, 1/exponent)
//         if (notation == "decimal") {
//             if (number < 1) {
//                 /a()/
//                 const leadingDigits = `${log}`.match(/^(\+|-)?([^\.]*)/)[2].length
//                `0.${("0").repeat(exponent)}`

//             }
//             (" ").repeat(exponent)
//         }
//         if (significantFigures != null) {
//             log
//         }
//     }

//     //
//     // alignment/padding
//     //
//     if ((expectedNumberOfDigits-0) > 0) {
//         if (align == "right") {
//             outputString = outputString.padStart(expectedNumberOfDigits, fillGapsWith)
//         } else if (align == "left") {
//             outputString = outputString.padEnd(expectedNumberOfDigits, fillGapsWith)
//         } else if (align == "center") {
//             const gap = expectedNumberOfDigits - outputString.length
//             // favor adding space to the left side
//             const left = Math.ceil(gap/2)
//             const right = gap - left
//             outputString = outputString.padStart(left, fillGapsWith).padEnd(right, fillGapsWith)
//         }
//     }

//     value.toString(8)
//     value.toPrecision(4)
//     Number.parseFloat(x).toExponential(f)
// }