/**
 * Returns a shallow-sorted version of an object either by keys or values.
 *
 * @param {Object} obj - The object to be sorted.
 * @param {Object} [options={}] - Optional sorting options.
 * @param {'keys'|'values'} [options.by='keys'] - Determines whether to sort by keys or values.
 * @param {Function} [options.func] - Optional custom comparator function for sorting.
 *   - If sorting by keys: `(a: string, b: string) => number`
 *   - If sorting by values: `([keyA, valueA], [keyB, valueB]) => number`
 *
 * @returns {Object} A new object with properties sorted shallowly based on the given criteria.
 *
 * @example
 * ```js
 * shallowSortObject({ b: 2, a: 1 }); // { a: 1, b: 2 } — sorted by keys
 * shallowSortObject({ b: 2, a: 1 }, { by: 'values' }); // { a: 1, b: 2 } — sorted by values
 * shallowSortObject({ b: 2, a: 1 }, { func: (a, b) => b.localeCompare(a) }); // { b: 2, a: 1 } — descending by keys
 * ```
 */
export const shallowSortObject = (obj,{by="keys", func}={}) => {
    if (by=="keys") {
        return Object.keys(obj).sort(func).reduce(
            (newObj, key) => { 
                newObj[key] = obj[key]; 
                return newObj
            }, 
            {}
        )
    } else {
        return Object.fromEntries(
            Object.entries(obj).sort(func || (([keyA, valueA], [keyB, valueB]) => valueA - valueB))
        )
    }
}