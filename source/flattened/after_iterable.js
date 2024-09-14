import { isAsyncIterable } from "./is_async_iterable.js"
import { iter } from "./iter.js"
import { deferredPromise } from "./deferred_promise.js"
import { makeIterable } from "./make_iterable.js"
import { afterIterable as after } from "./after_iterable.js"

/**
 * add "finally", "then", and "catch" to iterables
 *
 * @todo
 *     make sure chaining behavior matches promise chaining behavior
 * @example
 * ```js
 *     let selfCleaningIterable = after(
 *             stream.bytes
 *         ).then(
 *             (size)=>console.log(`Performed ${size} iterations`)
 *         ).catch(
 *             (error, index)=>console.error(`Error on index: ${index}`, error)
 *         ).finally(
 *             (size)=>stream.close()
 *         )
 * ```
 *
 * @param iterable - async or sync iterable, or generator
 * @returns {AsyncIterable|SyncIterable|Promise} - effectively the same iterator but with hooks, sync iterators will simultaniously be iterators and promises to allow for sync handling of iteration but async handling of callbacks
 *
 */
export function afterIterable(iterable, options={ _prevPromise:null }) {
    const { _prevPromise } = options
    iterable = makeIterable(iterable)
    const hooks = { then:null, catch:null, finally:null }
    let output = deferredPromise()
    delete output[Symbol.iterator]
    if (isAsyncIterable(iterable)) {
        output[Symbol.asyncIterator] = ()=>{
            const iterator = iter(iterable)
            let index = -1
            let hitError = false
            let outputResolvedAlready = false
            const handleFinally = async (returnValue, hitError, index)=>{
                if (!outputResolvedAlready) {
                    outputResolvedAlready = true
                    if (hooks.finally) {
                        await hooks.finally()
                    }
                    let wasRejected = false
                    try {
                        await _prevPromise
                    } catch (error) {
                        wasRejected = true
                        output.reject(error)
                    }
                    if (!wasRejected) {
                        if (hitError) {
                            output.reject(hitError)
                        } else {
                            output.resolve(returnValue)
                        }
                    }
                }
            }
            return {
                async next() {
                    let output = { value: null, done: true }
                    index++
                    try {
                        output = await iterator.next()
                    } catch (error) {
                        hitError = error
                        if (!hooks.catch) {
                            output.reject(error)
                        } else {
                            try {
                                await hooks.catch(error, index)
                                hitError = undefined
                                output.done = true
                            } catch (error) {
                                // only run reject after all the catches have been run
                                output.reject(error)
                            }
                        }
                    } finally {
                        if (output.done) {
                            if (!hitError) {
                                let maybeValue
                                try {
                                    maybeValue = await (hooks.then && hooks.then(index))
                                } catch (error) {
                                    hitError = error
                                    throw error
                                } finally {
                                    handleFinally(maybeValue, hitError, index)
                                }
                            }
                            handleFinally(undefined, hitError, index)
                        }
                    }
                    return output
                }
            }
        }
    } else {
        output[Symbol.iterator] = ()=>{
            const iterator = iter(iterable)
            let index = -1
            let hitError = false
            let outputResolvedAlready = false
            const handleFinally = async (returnValue, hitError, index)=>{
                if (!outputResolvedAlready) {
                    outputResolvedAlready = true
                    if (hooks.finally) {
                        await hooks.finally()
                    }
                    let wasRejected = false
                    try {
                        await _prevPromise
                    } catch (error) {
                        wasRejected = true
                        output.reject(error)
                    }
                    if (!wasRejected) {
                        if (hitError) {
                            output.reject(returnValue)
                        } else {
                            output.resolve(returnValue)
                        }
                    }
                }
            }
            return {
                next() {
                    let output = { value: null, done: true }
                    index++
                    try {
                        output = iterator.next()
                    } catch (error) {
                        hitError = true
                        // run all the catches, if one of them fails, still make sure the reject is still called
                        let isRejected = false
                        try {
                            (hooks.catch && hooks.catch(error, index))
                            // stop iter without failing/throwing
                            return { done: true }
                        } catch (error) {
                            // only run reject after all the catches have been run
                            isRejected = true
                            output.reject(error)
                        }
                        isRejected || output.reject(error)
                        throw error
                    } finally {
                        if (output.done) {
                            if (!hitError) {
                                let maybePromise
                                try {
                                    maybePromise = hooks.then && hooks.then(index)
                                } finally {
                                    handleFinally(maybePromise, hitError, index)
                                }
                            }
                            handleFinally(undefined, hitError, index)
                        }
                    }
                    return output
                }
            }
        }
    }
    // add the methods
    Object.assign(output, {
        then(callback) {
            hooks.then = callback
            return after(output, { _prevPromise: output })
        },
        catch(callback) {
            hooks.catch = callback
            return after(output, { _prevPromise: output })
        },
        finally(callback) {
            hooks.finally = callback
            return after(output, { _prevPromise: output })
        },
    })
    // carry over length if it exists
    if (typeof iterable.length == 'number' && iterable.length === iterable.length) {
        output.length = iterable.length
    }
    return output
}