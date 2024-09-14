import { deferredPromise } from "./deferred_promise.js"
import { makeIterator } from "./make_iterator.js"

export function asyncIteratorToList(asyncIterator) {
    // NOTE: in the future, its possible to detect the type of asyncIterator, and if it
    //       can be accessed by index (e.g. effectively a list of promises), then we could do 
    //       await Promise.all(asyncIterator) and be more efficient
    
    const promise = deferredPromise()
    let iterator
    try {
        iterator = makeIterator(asyncIterator)
        if (Number.isFinite(iterator?.length)) {
            promise.length = iterator.length
        }
    } catch (error) {
        promise.reject(error)
        return promise
    }
    promise[Symbol.asyncIterator] = ()=>iterator
    const results = []
    // recursively grab next
    const callNext = ()=>{
        let nextPromise
        try {
            nextPromise = iterator.next()
        } catch (error) {
            promise.reject(error)
            return
        }
        
        if (nextPromise == null) {
            promise.reject(Error(`When iterating over an async iterator, the .next() returned null/undefined`))
            return
        }

        if (!(typeof nextPromise.then == 'function')) {
            const {value, done} = nextPromise
            if (done) {
                promise.resolve(results)
            } else {
                results.push(value)
                callNext()
            }
            return
        }

        nextPromise.catch(promise.reject)
        nextPromise.then(({value, done})=>{
            if (done) {
                promise.resolve(results)
            } else {
                results.push(value)
                callNext()
            }
        })
    }
    promise.results = results
    try {
        callNext()
    } catch (error) {
        promise.reject(error)
    }
    return promise
}