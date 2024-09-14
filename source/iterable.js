import { isAsyncIterable } from "./flattened/is_async_iterable.js"
import { AsyncFunction } from "./flattened/async_function__class.js"
import { isSyncIterableObjectOrContainer } from "./flattened/is_sync_iterable_object_or_container.js"
import { deferredPromise } from "./flattened/deferred_promise.js"

// TODO:
    // add a forceAsync option to all iterables that are compatible with async
    // clean up the Iterable class
        // make more lightweight in terms of adding
            // - length check/preservation
            // - item access check/preservation
                // proxy object that iterates as much as needed to get the item
            // - sorted check/preservation
            // - flattended check/preservation
            // report error
            // push to end
            // inject to front
        // inside value add a item-access checker function
        // have error handling be better / more explicit
        // paritionBy TODO
        // reversed TODO
        // sortedBy TODO
        // splice TODO
        // slice TODO
        // append TODO
        // prepend TODO
    // fix the "after" function and test it more
    // redo the zip/map/etc to properly preserve item access and length
    // rewrite concurrentlyTransform()
    // create a helper for capping the amount of simultanous workers on an async iterable

// 
// light weight
// 
    import { emptyGeneratorObject } from "./flattened/empty_generator_object.js"; export { emptyGeneratorObject as emptyGeneratorObject }
    import { makeIterable } from "./flattened/make_iterable.js"; export { makeIterable as makeIterable }
    import { stop } from "./flattened/stop_symbol.js"; export { stop as Stop, stop as stop } // uppercase one should be deprecated 
    import { iter } from "./flattened/iter.js"; export { iter as iter }
    import { next } from "./flattened/next.js"; export { next as next }
    import { lazyMap as map } from "./flattened/lazy_map.js"; export { map as map }
    import { lazyFilter as filter } from "./flattened/lazy_filter.js"; export { filter as filter }
    import { lazyConcat as concat } from "./flattened/lazy_concat.js"; export { concat as concat }
    import { reduce } from "./flattened/reduce.js"; export { reduce as reduce }
    import { lazyFlatten as flattened } from "./flattened/lazy_flatten.js"; export { flattened as flattened }
    import { iterateReversed as reversed } from "./flattened/iterate_reversed.js"; export { reversed as reversed }
    import { afterIterable as after } from "./flattened/after_iterable.js"; export { after as after }

// 
// Iterable Class
// 
    import { forkBy } from "./flattened/fork_by.js"; export { forkBy as forkBy }
    import { Iterable } from "./flattened/iterable__class.js"; export { Iterable as Iterable }

// 
// handy helpers
// 
    import { asyncIteratorToList } from "./flattened/async_iterator_to_list.js"; export { asyncIteratorToList as asyncIteratorToList }
    import { zipLong as zip } from "./flattened/zip_long.js"; export { zip as zip }
    import { count } from "./flattened/count.js"; export { count as count }
    import { enumerate } from "./flattened/enumerate.js"; export { enumerate as enumerate }
    import { permute } from "./flattened/permute.js"; export { permute as permute }
    import { combinations } from "./flattened/combinations.js"; export { combinations as combinations }
    import { slices } from "./flattened/slices.js"; export { slices as slices }
    import { frequencyCount } from "./flattened/frequency_count.js"; export { frequencyCount as frequencyCount }
    import { concurrentlyTransform } from "./flattened/concurrently_transform.js"; export { concurrentlyTransform as concurrentlyTransform }