/**
 * format a number
 *
 * @param {"decimal"|"scientific"|"e"|"auto"} args.notation - which format
 * @param {null|Number} args.expectedNumberOfDigits - 
 * @param {"right"|"left"|"center"} args.align - 
 * @param {null|"max"|Number} args.significantFigures - 
 * @return {String} 
 *
 * @example
 * ```js
 *     does something
 * ```
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