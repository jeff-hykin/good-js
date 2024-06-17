import { get } from "./get.js"

/**
 * Function to sort alphabetically an array of objects by some specific key.
 *
 * @param {string[]} obj.keyList list of keys of which property to sort by
 * @param {Boolean} [obj.largestFirst=false] decending order
 * @example
 *    ```js
 *    let listOfObjects = [ { a:1 }, { a:3 }, { a:2 }, ]
 *    listOfObjects.sort(
 *        compareProperty({keyList:['a']})
 *    )
 *    //  [ { a: 1 }, { a: 2 }, { a: 3 } ]
 *    
 *    listOfObjects.sort(
 *      compareProperty({
 *        keyList:['a'],
 *        largestFirst:true
 *      })
 *    )
 *    //  [ { a: 3 }, { a: 2 }, { a: 1 } ]
 *    ```
 */
export const compareProperty = ({ keyList, largestFirst = false }) => {
    let comparison = (a, b) => {
        const aValue = get({ keyList, from: a, failValue: -Infinity })
        const bValue = get({ keyList, from: b, failValue: -Infinity })
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