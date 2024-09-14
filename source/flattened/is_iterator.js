/**
 * iterator has a next() function
 *
 * @example
 * ```js
 *     import { isIterator } from ""https://deno.land/x/good/flattened/is_iterator.js"
 * 
 *     // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
 *     const generatorFunc = async function*() { yield 1; yield 2; yield 3; }
 *     const generatorObj = generatorFunc()
 * 
 *     const iterator1 = { next: async function() { return { done: false, value: 1 } } }
 *     const iterator2 = { next: function() { return Promise.resolve({ done: false, value: 1 }) } }
 * 
 *     const iterable1 = [1,2,3]
 *     const iterable2 = { [Symbol.iterator]() { return iterator1 } }
 * 
 *     // false (no .next() function)
 *     isIterator(generatorFunc)
 *     isIterator(iterable1)
 *     isIterator(iterable2)
 * 
 *     // true
 *     isIterator(generatorObj)
 *     isIterator(iterator1)
 *     isIterator(iterator2)
 * ```
 *
 * @param value - any value
 * @returns {Boolean} output -
 */
export const isIterator = function(value) {
    return typeof value?.next == 'function'
}