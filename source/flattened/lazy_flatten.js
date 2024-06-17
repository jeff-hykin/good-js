import { makeIterable } from "./make_iterable.js"
import { isAsyncIterable } from "./is_async_iterable.js"
import { isSyncIterableObjectOrContainer } from "./is_sync_iterable_object_or_container.js"

/**
 * flattens iterables/async iterables
 *
 *
 * @example
 * ```js
 *     import { lazyFlatten } from "https://deno.land/x/good/flattened/lazy_flatten.js"
 *     var iterable = [ [1.1, 1.2], [2.1, 2.2], [[[[[3,4]]]]] ]
 *     // works even for indefinte-length iterables (generators)
 * 
 *     lazyFlatten({iterable: iterable})
 *     lazyFlatten({iterable: iterable, depth: 2})
 *     lazyFlatten({iterable: null }) // returns empty iterable 
 * ```
 * 
 * @param arg1.iterable
 * @param arg1.depth
 * @param arg1.asyncsInsideSyncIterable - if the top level iterable is synchonous, but there are nested items that are async iterables, and you want to flatten those async iterables, then set this argument to true
 * @returns {Object} output - an iterable or async iterable (based on input)
 *
 */
export function lazyFlatten({iterable, depth=Infinity, asyncsInsideSyncIterable=false}) {
    if (depth <= 0) {
        return iterable
    }
    iterable = makeIterable(iterable)
    if (isAsyncIterable(iterable) || asyncsInsideSyncIterable) {
        return (async function*(){
            for await (const each of iterable) {
                if (isAsyncIterable(each) || isSyncIterableObjectOrContainer(each)) {
                    for await (const eachChild of lazyFlatten({ iterable: each, depth: depth-1, asyncsInsideSyncIterable })) {
                        yield eachChild
                    }
                } else {
                    yield each
                }
            }
        })()
    } else {
        return (function*(){
            for (const each of iterable) {
                if (isSyncIterableObjectOrContainer(each)) {
                    for (const eachChild of lazyFlatten({ iterable: each, depth: depth-1, })) {
                        yield eachChild
                    }
                } else {
                    yield each
                }
            }
        })()
    }
}