/**
 * @param {Array} listOfNumbers - yup
 * @return {Object} {min,max,range,average,median,sum}
 *
 * @example
 * ```js
 *     const { min,max,range,average,median,sum } = stats([1,50352,3,4,5555234])
 * ```
 */
export const vectorSummaryStats = (listOfNumbers) => {
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