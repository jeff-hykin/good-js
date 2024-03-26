import { deferredPromise } from "./deferred_promise.js"

const objectPrototype = Object.getPrototypeOf({})
/**
 * Promise.allRecursively
 *
 * @example
 *     await recursivePromiseAll({a:1, b: [ 1, 2, new Promise((resolve, reject)=>resolve(10))] })
 *     // >>> { a: 1, b: [ 1, 2, 10 ] }
 */
export const recursivePromiseAll = (object, alreadySeen=new Map()) => {
    if (alreadySeen.has(object)) {
        return alreadySeen.get(object)
    }
    if (object instanceof Promise) {
        return object
    } else if (object instanceof Array) {
        const resolveLink = deferredPromise()
        alreadySeen.set(object, resolveLink)
        Promise.all(
            object.map(each=>recursivePromiseAll(each, alreadySeen))
        ).catch(
            resolveLink.reject
        ).then(
            resolveLink.resolve
        )
        return resolveLink
    // if pure object
    } else if (Object.getPrototypeOf(object) == objectPrototype) {
        const resolveLink = deferredPromise()
        alreadySeen.set(object, resolveLink)
        ;((async ()=>{
            try {
                const keysAndValues = await Promise.all(
                    Object.entries(object).map(
                        (keyAndValue)=>recursivePromiseAll(keyAndValue, alreadySeen)
                    )
                )
                resolveLink.resolve(Object.fromEntries(keysAndValues))
            } catch (error) {
                resolveLink.reject(error)
            }
        })())
        return resolveLink
    // either a primitive or a custom object that doesnt inhert from a promise
    } else {
        return object
    }
}