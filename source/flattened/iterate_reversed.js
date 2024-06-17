import { isAsyncIterable } from "./is_async_iterable.js"
import { asyncIteratorToList } from "./async_iterator_to_list.js"

export function iterateReversed(data) {
    // efficient iterator when the length is known (and all values are accessible)
    const isArrayOrString = data instanceof Array || typeof data == 'string'
    const isSet = data instanceof Set
    if (isArrayOrString || isSet) {
        const length = isArrayOrString ? data.length : data.size
        let lastIndex = length
        const iterator = (function*(){
            while (lastIndex > 0) {
                yield data[--lastIndex]
            }
        })()
        iterator.length = length
        return iterator
    }
    
    // aggregate if necessary
    if (!isAsyncIterable(data)) {
        return [...data].reverse()
    } else {
        return asyncIteratorToList(data).then(data=>reversed(data))
    }
}