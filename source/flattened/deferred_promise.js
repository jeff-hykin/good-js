/**
 * A promise that will be given a callback later
 *
 * @example
 * ```js
 * console.log(`\n# test1\n`)
 * var deferred = deferredPromise()
 * deferred.resolve("hi")
 * await deferred.then(x=>console.log("test 1", x))
 * 
 * console.log(`\n# test2\n`)
 * var deferred = deferredPromise()
 * let otherPromise = deferred.then(
 *     x=>console.log(`2: hello I resolved to ${x}`)
 * ).catch(
 *     x=>console.log(`I caught ${x}`)
 * )
 * 
 * // we might expect this to call the .then()
 * deferred.resolve(
 *     // BUT
 *     // because it resolves to a rejected promise
 *     // it will call the .catch()
 *     Promise.reject(
 *         new Error("I resolve to a rejected promise 2")
 *     )
 * )
 * // somewhere else
 * try {
 *     await deferred
 * } catch (e) {
 *     console.log(`original location catching ${e}`)
 * }
 * await otherPromise
 * ```
 */
export function deferredPromise() {
    // originally based on https://deno.land/std@0.208.0/async/deferred.ts?source=#L33
    let methods
    let state = "pending"
    let errorArgs
    const promise = new Promise((resolve, reject) => {
        methods = {
            resolve(value) {
                if (state === "pending") {
                    // this handles the chaining problem where `value` is, itself, a promise
                    Promise.resolve(value).then(
                        (result)=>{
                            state = "fulfilled"
                            resolve(result)
                        }
                    ).catch(
                        (...args)=>{
                            state = "rejected"
                            reject(...args)
                        }
                    )
                }
            },
            reject(reason) {
                if (state === "pending") {
                    state = "rejected"
                    reject(reason)
                }
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