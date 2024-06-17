/**
 * @param {Object} 
 * @return {Array} values evenly distributed between min/max (length=quantity)
 *
 * @example
 * ```js
 *     const values = spread({ quantity: 10, min: 1.37, max: 7.86 })
 * ```
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