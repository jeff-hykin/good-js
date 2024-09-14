/**
 * A promise that will be given a callback later
 *
 * @example
 * ```js
 * import { deferredPromise } from "https://deno.land/x/good/flattened/deferred_promise.js"
 * const deferred = deferredPromise()
 * deferred.resolve(1)
 * deferred.then(x=>console.log(x))
 * ```
 */
export function deferredPromise() {
    // originally based on https://deno.land/std@0.208.0/async/deferred.ts?source=#L33
    let methods
    let state = "pending"
    const promise = new Promise((resolve, reject) => {
        methods = {
            resolve(value) {
                if (value?.catch instanceof Function) {
                    value.catch(reject)
                }
                if (value?.then instanceof Function) {
                    // recurse until the value is not a promise
                    value.then(methods.resolve)
                } else {
                    state = "fulfilled"
                    resolve(value)
                }
            },
            reject(reason) {
                state = "rejected"
                reject(reason)
            },
            // give a more helpful error message
            [Symbol.iterator]() {
                throw Error(`You're trying to sync-iterate over a promise`)
            },
        }
    })
    Object.defineProperty(promise, "state", { get: () => state })
    return Object.assign(promise, methods)
}
