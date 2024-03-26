// https://deno.land/std@0.161.0/async/deferred.ts
export function deferred() {
    let methods
    let state = "pending"
    const promise = new Promise((resolve, reject) => {
        methods = {
            async resolve(value) {
                await value
                state = "fulfilled"
                resolve(value)
            },
            // deno-lint-ignore no-explicit-any
            reject(reason) {
                state = "rejected"
                reject(reason)
            },
        }
    })
    Object.defineProperty(promise, "state", { get: () => state })
    return Object.assign(promise, methods)
}
