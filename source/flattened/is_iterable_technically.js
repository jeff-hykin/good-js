/**
 * anything that works with "for of" loops
 *
 * @example
 * ```js
 *     import { isIterableTechnically } from ""https://deno.land/x/good/flattened/is_iterable_technically.js"
 * 
 *     // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
 *     const generatorFunc = async function*() { yield 1; yield 2; yield 3; }
 *     const generatorObj = generatorFunc()
 * 
 *     const iterable1 = [1,2,3]
 *     const iterable2 = { [Symbol.iterator]() { return iterator1 } }
 * 
 *     const iterator1 = { next: async function() { return { done: false, value: 1 } } }
 *     const iterator2 = { next: function() { return Promise.resolve({ done: false, value: 1 }) } }
 * 
 * 
 *     // true
 *     isIterableTechnically("hi") // string is iterable
 *     isIterableTechnically(generatorObj)
 *     isIterableTechnically(new Map())
 *     isIterableTechnically(iterable1)
 *     isIterableTechnically(iterable2)
 * 
 *     // false
 *     isIterableTechnically({})
 *     isIterableTechnically(generatorFunc)
 *     isIterableTechnically(iterator1)
 *     isIterableTechnically(iterator2)
 * ```
 *
 * @param value - any value
 * @returns {Boolean} output -
 *
 */
export const isIterableTechnically = function(value) {
    return value != null && (typeof value[Symbol.iterator] == 'function' || typeof value[Symbol.asyncIterator] == 'function')
}