import { AsyncFunction } from "./async_function__class.js"

const unset = Symbol()

/**
 * A promise that can be cancelled (without triggering unhandled rejection)
 *
 * @example
 * ```js
 * console.log(`test1`)
 * var p = new CancelablePromise()
 * p.then((a)=>console.log("then1",a)).catch((a)=>console.log("catch1",a)).then((willBeUndef)=>console.log("then1.2",willBeUndef))
 * p.then((a)=>console.log("then2",a))
 * p.resolve(10)
 * console.log(await p)
 * console.log(``)
 * 
 * console.log(`test2`)
 * var p = new CancelablePromise()
 * p.then((a)=>console.log("then1",a)).catch((a)=>console.log("catch1",a)).then((willBeUndef)=>console.log("then1.2",willBeUndef))
 * p.then((a)=>console.log("then2",a))
 * p.cancel()
 * // no dangling promise or unhandled rejection
 * console.log(``)
 * 
 * console.log(`test3`)
 * var p = new CancelablePromise()
 * //p.then((a)=>console.log("then_c1",a)).catch((a)=>console.log("catch1",a)).then((willBeUndef)=>console.log("then_c1.2",willBeUndef))
 * //p.then((a)=>console.log("then_c2",a)).catch((a)=>console.log("catch2",a))
 * let p2 = ((async ()=>{
 *     try {
 *         await p
 *     } catch (error) {
 *         console.log("caught",error)
 *     }
 * })())
 * console.log(`calling reject`)
 * p.reject(new Error("test"))
 * await p2
 * ```
 */
export class CancelablePromise {
    constructor({silent=false}={}) {
        Object.setPrototypeOf(CancelablePromise.prototype, Object.getPrototypeOf(Promise.resolve()))
        this.value = unset
        this.error = unset
        this.cancelled = false
        this.thenCallbacks = []
        this.thenPromises = []
        this.thenRejectCallbacks = []
        this.catchCallbacks = []
        this.catchPromises = []
        this.finallyCallbacks = []
        this.finallyPromises = []
        this.silent = silent
    }
    get state() {
        if (this.value !== unset) {
            return "resolved"
        } else if (this.error !== unset) {
            return "rejected"
        } else if (this.cancelled) {
            return "cancelled"
        } else {
            return "pending"
        }
    }
    then(callback, reject) {
        // if already resolved/rejected/cancelled
        if (this.value !== unset) {
            if (!callback) {
                return Promise.resolve(this.value)
            }
            if (callback instanceof AsyncFunction) {
                return callback(this.value)
            } else {
                try {
                    return Promise.resolve(callback(this.value))
                } catch (error) {
                    return Promise.reject(error)
                }
            }
        } else if (this.error !== unset) {
            // this will
            if (reject) {
                try {
                    // if this func is getting triggered by the await keyword, then this reject call will never throw
                    // if the func is async an> throws, then the Promise.resolve will turn itself into a reject
                    return Promise.resolve(reject(this.error))
                // if it sync throws
                } catch (error) {
                    // if it does throw, we need to trigger downstream .catch() handlers
                    return Promise.reject(error)
                }
            }
            return Promise.reject(this.error)
        } else if (this.cancelled) {
            let newPromise = new CancelablePromise()
            newPromise.cancel()
            return newPromise
        }
        
        // if will be resolved later
        let response = new CancelablePromise()
        this.thenCallbacks.push(callback)
        this.thenRejectCallbacks.push(reject)
        this.thenPromises.push(response)
        return response
    }
    catch(callback) {
        // if already resolved/rejected/cancelled
        if (this.error !== unset) {
            if (!callback) {
                return Promise.reject(this.error)
            }
            if (callback instanceof AsyncFunction) {
                return callback(this.error)
            } else {
                try {
                    return Promise.resolve(callback(this.error))
                } catch (error) {
                    return Promise.reject(error)
                }
            }
        } else if (this.value !== unset) {
            return Promise.resolve(this.value)
        } else if (this.cancelled) {
            let newPromise = new CancelablePromise()
            newPromise.cancel()
            return newPromise
        }
        
        // if will be resolved later
        let response = new CancelablePromise()
        this.catchCallbacks.push(callback)
        this.catchPromises.push(response)
        return response
    }
    finally(callback) {
        // if already resolved/rejected/cancelled
        if (this.value !== unset || this.error !== unset || this.cancelled) {
            if (!callback) {
                if (this.value !== unset) {
                    return Promise.resolve(this.value)
                } else if (this.error !== unset) {
                    return Promise.reject(this.error)
                } else {
                    let newPromise = new CancelablePromise()
                    newPromise.cancel()
                    return newPromise
                }
            }
            
            if (callback instanceof AsyncFunction) {
                return callback()
            } else {
                try {
                    return Promise.resolve(callback(this.value))
                } catch (error) {
                    return Promise.reject(error)
                }
            }
        }

        let response = new CancelablePromise()
        this.finallyCallbacks.push(callback)
        this.finallyPromises.push(response)
        return response
    }
    async cancel() {
        if (this.state !== "pending") {
            if (!this.silent) {
                console.warn(`called .cancel() on a CancelablePromise that was already ${this.state}`)
            }
            return
        }
        this.cancelled = true
        for (let each of this.thenPromises.concat(this.catchPromises)) {
            if (each) {
                each.cancel()
            }
        }
        // of the 3 only run finally's on cancel
        var i=-1
        for (var callback of this.finallyCallbacks) {
            i++
            const promise = this.finallyPromises[i]
            try {
                const result = await callback()
                promise.resolve(result)
            } catch (error) {
                promise.reject(error)
            }
        }
        delete this.thenCallbacks
        delete this.thenPromises
        delete this.thenRejectCallbacks
        delete this.catchCallbacks
        delete this.catchPromises
        delete this.finallyCallbacks
        delete this.finallyPromises
    }
    async resolve(value) {
        if (this.state !== "pending") {
            if (!this.silent) {
                console.warn(`called .resolve() on a CancelablePromise that was already ${this.state}`)
            }
            return
        }
        let actualValue
        let errorValue
        try {
            actualValue = await value
            this.value = actualValue
        } catch (error) {
            this.reject(error)
            return
        }
        
        // 
        // then's
        // 
        var i=-1
        for (var callback of this.thenCallbacks) {
            i++
            const promise = this.thenPromises[i]
            try {
                const result = await callback(actualValue)
                promise.resolve(result)
            } catch (error) {
                promise.reject(error)
            }
        }
        
        // 
        // catch
        // 
        for (var each of this.catchPromises) {
            each.resolve(actualValue)
        }
        
        // 
        // finally
        // 
        var i=-1
        for (var callback of this.finallyCallbacks) {
            i++
            const promise = this.finallyPromises[i]
            try {
                const result = await callback()
                promise.resolve(result)
            } catch (error) {
                promise.reject(error)
            }
        }
        delete this.thenCallbacks
        delete this.thenPromises
        delete this.thenRejectCallbacks
        delete this.catchCallbacks
        delete this.catchPromises
        delete this.finallyCallbacks
        delete this.finallyPromises
    }
    async reject(error) {
        if (this.state !== "pending") {
            if (!this.silent) {
                console.warn(`called .reject() on a CancelablePromise that was already ${this.state}`)
            }
            return
        }
        this.error = error
        let actualError
        try {
            actualError = await error
        } catch (error) {
            actualError = error
        }

        // 
        // then
        // 
        var i=-1
        for (var promise of this.thenPromises) {
            i++
            const callbackForReject = this.thenRejectCallbacks[i]
            let errorForThisPromise = actualError
            if (callbackForReject) {
                let promiseForReject
                if (callbackForReject instanceof AsyncFunction) {
                    promiseForReject = callbackForReject(actualError)
                } else {
                    try {
                        promiseForReject = Promise.resolve(callbackForReject(actualError))
                    } catch (error) {
                        promiseForReject = Promise.reject(error)
                    }
                }
                // if the reject returns a real value, then the .then() is treated like a .catch() (a subsequent .then() will be called)
                // if the reject throws, then it is triggers subsequent .catch() handlers
                promiseForReject.then(value=>promise.resolve(value)).catch((error)=>promise.reject(error))
            } else {
                promise.reject(errorForThisPromise)
            }
        }

        // 
        // catch
        // 
        var i=-1
        for (var callback of this.catchCallbacks) {
            i++
            const promise = this.catchPromises[i]
            try {
                const result = await callback(actualError)
                promise.resolve(result)
            } catch (error) {
                promise.reject(error)
            }
        }

        // 
        // finally
        // 
        var i=-1
        for (var callback of this.finallyCallbacks) {
            i++
            const promise = this.finallyPromises[i]
            try {
                const result = await callback()
                promise.resolve(result)
            } catch (error) {
                promise.reject(error)
            }
        }
        delete this.thenCallbacks
        delete this.thenPromises
        delete this.thenRejectCallbacks
        delete this.catchCallbacks
        delete this.catchPromises
        delete this.finallyCallbacks
        delete this.finallyPromises
    }
}