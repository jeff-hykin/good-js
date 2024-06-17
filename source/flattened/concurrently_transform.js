import { asyncIteratorToList } from "./async_iterator_to_list.js"

const ERROR_WHILE_MAPPING_MESSAGE = "Threw while mapping"
//
// adapted/enhanced version of https://github.com/denoland/deno_std/blob/215139c170cbcc0cb93fb9c463f63504cf7475b6/async/pool.ts
//
/**
 * pooledMap transforms values from an (async) iterable into another async
 * iterable. The transforms are done concurrently, with a max concurrency
 * defined by the poolLimit.
 *
 * If an error is thrown from `transformFunction`, no new transformations will begin.
 * All currently executing transformations are allowed to finish and still
 * yielded on success. After that, the rejections among them are gathered and
 * thrown by the iterator in an `AggregateError`.
 *
 * @param args.iterator The input iterator for mapping.
 * @param args.poolLimit The maximum count of items being processed concurrently.
 * @param args.transformFunction The function to call for every item of the iterator.
 * @param args.awaitAll Whether or not to await all at the end
 * @return {AsyncIterator}
 * @example
 * ```js
 *     for await (const subPaths of concurrentlyTransform({
 *        iterator: Deno.readDir("."),
 *        transformFunction: (each, index)=>each.isDirectory&&[...Deno.readDirSync(each.name)],
 *     })) {
 *         if (subPaths) { console.log(subPaths) }
 *     }
 *
 *     const listOfSubpaths = await concurrentlyTransform({
 *        iterator: Deno.readDir("."),
 *        awaitAll: true,
 *        transformFunction: (each, index)=>each.isDirectory&&[...Deno.readDirSync(each.name)],
 *     })
 * ```
 */
export function concurrentlyTransform({ iterator, transformFunction, poolLimit = null, awaitAll = false }) {
    poolLimit = poolLimit || concurrentlyTransform.defaultPoolLimit
    // Create the async iterable that is returned from this function.
    const res = new TransformStream({
        async transform(p, controller) {
            try {
                const s = await p
                controller.enqueue(s)
            } catch (e) {
                if (e instanceof AggregateError && e.message == ERROR_WHILE_MAPPING_MESSAGE) {
                    controller.error(e)
                }
            }
        },
    })

    // Start processing items from the iterator
    const mainPromise = (async () => {
        const writer = res.writable.getWriter()
        const executing = []
        try {
            let index = 0
            for await (const item of iterator) {
                const p = Promise.resolve().then(() => transformFunction(item, index))
                index++
                // Only write on success. If we `writer.write()` a rejected promise,
                // that will end the iteration. We don't want that yet. Instead let it
                // fail the race, taking us to the catch block where all currently
                // executing jobs are allowed to finish and all rejections among them
                // can be reported together.
                writer.write(p)
                const e = p.then(() => executing.splice(executing.indexOf(e), 1))
                executing.push(e)
                if (executing.length >= poolLimit) {
                    await Promise.race(executing)
                }
            }
            // Wait until all ongoing events have processed, then close the writer.
            await Promise.all(executing)
            writer.close()
        } catch {
            const errors = []
            for (const result of await Promise.allSettled(executing)) {
                if (result.status == "rejected") {
                    errors.push(result.reason)
                }
            }
            writer.write(Promise.reject(new AggregateError(errors, ERROR_WHILE_MAPPING_MESSAGE))).catch(() => {})
        }
    })()
    const asyncIterator = res.readable[Symbol.asyncIterator]()
    if (!awaitAll) {
        return asyncIterator
    } else {
        return mainPromise.then(() => asyncIteratorToList(asyncIterator))
    }
}
concurrentlyTransform.defaultPoolLimit = 40 // my best guess at an average-optimal number of parallel workers