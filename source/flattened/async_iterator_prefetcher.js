/**
 * Asynchronously prefetches items from an async iterable into a buffer and yields them as they become available.
 *
 * This function is useful when consuming an async iterable where fetching the next item has latency (e.g., network or disk),
 * and you want to prefetch items ahead of time to improve throughput.
 *
 * @template T
 * @param {AsyncIterable<T>} iter - The async iterable to consume.
 * @param {Object} [options={}] - Configuration options.
 * @param {number} [options.bufferSize=10] - The maximum number of items to prefetch and buffer.
 *
 * @returns {AsyncGenerator<T>} An async generator that yields items from the iterable with prefetching.
 *
 * @example
 * ```js
 * const slowIterable = {
 *   async *[Symbol.asyncIterator]() {
 *     for (let i = 0; i < 5; i++) {
 *       await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
 *       yield i;
 *     }
 *   }
 * };
 *
 * for await (const item of asyncIterablePrefetcher(slowIterable, { bufferSize: 2 })) {
 *   console.log(item); // Items will be available more quickly due to prefetching
 * }
 * ```
 */
export async function* asyncIterablePrefetcher(iter, {bufferSize=10}={}) {
    const buffer = []
    const iterator = iter[Symbol.asyncIterator]()
    let done = false
    let error = null

    const fillBuffer = async () => {
        try {
            while (!done && buffer.length < bufferSize) {
                const { value, done: iterDone } = await iterator.next()
                if (iterDone) {
                    done = true
                    break
                }
                buffer.push(value)
            }
        } catch (err) {
            error = err
            done = true
        }
    }

    // Start prefetching in the background
    let prefetching = fillBuffer()

    while (!done || buffer.length > 0) {
        // Wait for buffer to fill if it's empty
        if (buffer.length === 0) {
            await prefetching
        }

        // If an error occurred during prefetching
        if (error) {
            throw error
        }

        // Yield the next item
        if (buffer.length > 0) {
            yield buffer.shift()
        }

        // Start the next prefetch if needed
        if (!done && buffer.length < bufferSize) {
            prefetching = fillBuffer()
        }
    }
}
