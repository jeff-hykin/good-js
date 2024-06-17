/**
 * Function to sort alphabetically an array of objects by some specific key.
 *
 * @param {Function} obj.elementToNumber function to get the sort priority
 * @param {Boolean} [obj.largestFirst=false] decending order
 * @example
 *     ```js
 *     let listOfObjects = [ { a:1 }, { a:3 }, { a:2 }, ]
 *     listOfObjects.sort(
 *         compare({elementToNumber:each=>each.a })
 *     )
 *     //  [ { a: 1 }, { a: 2 }, { a: 3 } ]
 *    
 *     listOfObjects.sort(
 *       objectCompare({
 *         elementToNumber:each=>each.a,
 *         largestFirst:true
 *       })
 *     )
 *     //  [ { a: 3 }, { a: 2 }, { a: 1 } ]
 *     ```
 */
export const objectCompare = ({ elementToNumber, largestFirst = false }) => {
    let comparison = (a, b) => {
        const aValue = elementToNumber(a)
        const bValue = elementToNumber(b)
        if (typeof aValue == "number") {
            return aValue - bValue
        } else {
            return aValue.localeCompare(bValue)
        }
    }
    if (largestFirst) {
        let oldComparison = comparison
        comparison = (b, a) => oldComparison(a, b)
    }
    return comparison
}