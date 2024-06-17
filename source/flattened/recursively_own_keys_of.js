import { recursivelyIterateOwnKeysOf } from "./recursively_iterate_own_keys_of.js"
/**
 * Deep iterate object children DFS-like
 *
 * @param {Object} obj - Any object
 * @return {string[][]} lists of key-lists
 *
 * @example
 *     ```js
 *     recursivelyOwnKeysOf({ a: { b: 1} })
 *     >>> [
 *         [ 'a', ],
 *         [ 'a', 'b' ],
 *     ]
 *     ```
 */
export const recursivelyOwnKeysOf = (obj, recursionProtecion=new Set()) => [...recursivelyIterateOwnKeysOf(obj, recursionProtecion)]