// extracted from https://deno.land/std@0.161.0/async/mod.ts?s=deferred

/**
 * deferredPromise
 *
 * @example
 * ```js
 *    import { deferredPromise } from "https://deno.land/std@0.161.0/async/deferred.ts";
 *
 *    const aPromise = deferredPromise()
 *    aPromise.resolve(42)
 *    aPromise.reject(new Error(`error`)) // alternatively
 * ```
 */
export function deferredPromise() {
    let methods
    let state = "pending"
    const promise = new Promise((resolve, reject) => {
        methods = {
            async resolve(value) {
                await value
                state = "fulfilled"
                resolve(value)
            },
            reject(reason) {
                state = "rejected"
                reject(reason)
            },
        }
    })
    Object.defineProperty(promise, "state", {
        get: () => state,
    })
    return Object.assign(promise, methods)
}

// classed version of defered promise 
export class DeferedPromise extends Promise {
    constructor(...args) {
        let methods
        let state = "pending"
        super((resolve, reject)=>{
            methods = {
                async resolve(value) {
                    await value
                    state = "fulfilled"
                    resolve(value)
                },
                reject(reason) {
                    state = "rejected"
                    reject(reason)
                },
            }
        })
        Object.defineProperty(this, "state", {
            get: () => state,
        })
        Object.assign(this, methods)
    }
}

const objectPrototype = Object.getPrototypeOf({})

/**
 * Promise.allRecursively
 *
 * @example
 * * ```js
 *     await recursivePromiseAll({a:1, b: [ 1, 2, new Promise((resolve, reject)=>resolve(10))] })
 *     // >>> { a: 1, b: [ 1, 2, 10 ] }
 * ```
 */
export const recursivePromiseAll = (object, alreadySeen = new Map()) => {
    if (alreadySeen.has(object)) {
        return alreadySeen.get(object)
    }
    if (object instanceof Promise) {
        return object
    } else if (object instanceof Array) {
        const resolveLink = deferredPromise()
        alreadySeen.set(object, resolveLink)
        Promise.all(object.map((each) => recursivePromiseAll(each, alreadySeen)))
            .catch(resolveLink.reject)
            .then(resolveLink.resolve)
        return resolveLink
        // if pure object
    } else if (Object.getPrototypeOf(object) == objectPrototype) {
        const resolveLink = deferredPromise()
        alreadySeen.set(object, resolveLink)
        ;(async () => {
            try {
                const keysAndValues = await Promise.all(Object.entries(object).map((keyAndValue) => recursivePromiseAll(keyAndValue, alreadySeen)))
                resolveLink.resolve(Object.fromEntries(keysAndValues))
            } catch (error) {
                resolveLink.reject(error)
            }
        })()
        return resolveLink
        // either a primitive or a custom object that doesnt inhert from a promise
    } else {
        return object
    }
}
