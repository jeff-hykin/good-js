/**
 * Calculates a function from given x and y values, using linear interpolation.
 * The function interpolates between points
 *
 * @example
 * ```js
 * const xVals = [1, 2, 4, 5];
 * const yVals = [2, 3, 5, 7];
 *
 * const interpolationFunction = pointsToFunction({xValues: xVals, yValues: yVals, areSorted: false });
 *
 * console.log(interpolationFunction(3)); // 4 
 * ```
 * @param {number[]} xValues - The x-values of the data points.
 * @param {number[]} yValues - The y-values of the data points.
 * @param {boolean} [areSorted=false] - If true, the xValues are assumed to be sorted in increasing order
 * @param {string} [method="linearInterpolation"] - The interpolation method (only "linearInterpolation" is supported).
 *
 * @returns {function} - A function that, given a new x, will return an interpolated y.
 */
export function pointsToFunction({xValues, yValues, areSorted = false, method = "linearInterpolation"}) {
    if (method !== "linearInterpolation") {
        throw new Error('Sorry, only "linearInterpolation" is supported at this time')
    }

    const numberOfValues = xValues.length
    if (numberOfValues !== yValues.length) {
        throw new Error("xValues and yValues must have the same length")
    }
    if (numberOfValues === 0) {
        throw new Error("called pointsToFunction() but provided an empty list of points")
    }

    // Horizontal line for a single point
    if (numberOfValues === 1) {
        return function (x_value) {
            return yValues[0]
        }
    }

    if (!areSorted) {
        // Sort the xValues and yValues if not sorted
        const zipped = zip(xValues, yValues)
        zipped.sort((a, b) => a[0] - b[0])
        var [xValues, yValues] = unzip(zipped)
    }

    const slopes = []
    const minimumX = xValues[0]
    const maximumX = xValues[numberOfValues - 2] // The second-to-last element, due to indexing

    function innerFunction(x) {
        let xIndex
        if (x >= maximumX) {
            xIndex = numberOfValues - 2
        } else if (x <= minimumX) {
            xIndex = 0
        } else {
            // Binary search for the correct xIndex
            let lowIndex = 0
            let highIndex = numberOfValues - 1 // numberOfValues must be at least 2 by this point (so high will never equal low)

            while (lowIndex+1 < highIndex) {
                const midIndex = Math.floor((lowIndex + highIndex) / 2)
                const midValue = xValues[midIndex]
                if (midValue < x) {
                    lowIndex = midIndex
                } else {
                    highIndex = midIndex
                }
            }

            xIndex = lowIndex
        }

        // Perform linear interpolation / extrapolation
        const x0 = xValues[xIndex]
        const x1 = xValues[xIndex + 1]
        const y0 = yValues[xIndex]
        const y1 = yValues[xIndex + 1]

        // Vertical line case (x1 - x0 == 0)
        if (x1 - x0 === 0) {
            return y1
        }

        let slope = (y1 - y0) / (x1 - x0)
        const y = y0 + slope * (x - x0)

        return y
    }

    return innerFunction
}

/**
 * A helper function to calculate the mean of an array.
 *
 * @param {number[]} arr - The array of numbers.
 * @returns {number} - The mean of the array.
 */
function mean(arr) {
    const sum = arr.reduce((acc, val) => acc + val, 0)
    return sum / arr.length
}

/**
 * A helper function to zip two arrays together.
 *
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @returns {Array} - An array of pairs from arr1 and arr2.
 */
function zip(arr1, arr2) {
    return arr1.map((val, index) => [val, arr2[index]])
}

/**
 * A helper function to unzip an array of pairs into two separate arrays.
 *
 * @param {Array} arr - The array of pairs.
 * @returns {Array[]} - A two-dimensional array with the unzipped values.
 */
function unzip(arr) {
    return arr.reduce(
        ([arr1, arr2], [a, b]) => {
            arr1.push(a)
            arr2.push(b)
            return [arr1, arr2]
        },
        [[], []]
    )
}
