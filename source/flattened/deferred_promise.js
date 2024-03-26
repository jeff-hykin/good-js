// originally based on https://deno.land/std@0.208.0/async/deferred.ts?source=#L33
export function deferredPromise() {
    let methods
    let state = "pending"
    const promise = new Promise((resolve, reject) => {
        methods = {
            resolve(value) {
                if (value.catch instanceof Function) {
                    value.catch(reject)
                }
                if (value.then instanceof Function) {
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
        }
    })
    Object.defineProperty(promise, "state", { get: () => state })
    return Object.assign(promise, methods)
}
