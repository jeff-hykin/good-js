import { AsyncFunction } from "./async_function__class.js"
import { CancelablePromise } from "./cancelable_promise__class.js"


/**
 * throttle requires some explaining
 *
 * @example
 * ```js
 * let sayHello = throttle(1000, ()=>{
 *         console.log("Hello, world!")
 *     }
 * )
 * // NOTE: calls get buffered (buffer size of 1)
 * console.log(`attempt 1`)
 * setTimeout(sayHello, 0)
 * setTimeout(sayHello, 500)
 * setTimeout(sayHello, 900)
 * // hello world would be printed twice (once at 0ms, and once at 1000ms)
 * 
 * await new Promise(r=>setTimeout(r,2000))
 * console.log(`attempt 2`)
 * setTimeout(sayHello, 0)
 * setTimeout(sayHello, 0)
 * // hello world would STILL be printed twice (once at 0ms, and once at 1000ms)
 * 
 * await new Promise(r=>setTimeout(r,2000))
 * console.log(`attempt 3`)
 * setTimeout(sayHello, 0)
 * // hello world would printed only once (at 1000ms)
 * 
 * await new Promise(r=>setTimeout(r,1000))
 * ```
 *
 */
export function throttle(delay, func) {
    if (typeof func !== "function") {
        throw new Error("throttle requires a function as the second argument")
    }
    let scheduledPromises = []
    // this wrapper forces error handling to be done with .catch()
    // (otherwise some errors will be uncatchable and cause uncaught rejection)
    if (!(func instanceof AsyncFunction)) { // NOTE: this is only skipped if the function is literally/directly async, not if it merely returns a promise
        const actualFunc = func
        // if func is sync and throws an error, now that error will end up inside of a promise
        func = async (...args)=>actualFunc(...args)
    }
    
    // the decorated function
    function returnFunc(...args) {
        const promise = new CancelablePromise()
        
        // if a func-call is already scheduled (timeoutId)
        if (returnFunc.timeoutId) {
            // tell the scheduled func-call about the latest args to use
            returnFunc.scheduledArgs = args
            // cancel the existing promises (only resolve latest one)
            for (let each of scheduledPromises) {
                each.cancel()
            }
            scheduledPromises.length = 0
            // use this one as the one that will resolve on the timeout
            scheduledPromises.push(promise)
            return promise
        // if one is not scheduled, check if we execute immediately, or schedule
        } else {
            const canExecuteImmediately = (Date.now() - returnFunc.lastExecutionTime) >= returnFunc.delay
            if (canExecuteImmediately) {
                returnFunc.lastExecutionTime = Date.now()
                return promise.resolve(func(...returnFunc.scheduledArgs))
            // schedule a self-clearing timeout
            } else {
                scheduledPromises.push(promise)
                returnFunc.timeoutId = setTimeout(() => {
                    let promiseToResolve = scheduledPromises.pop()
                    for (let each of scheduledPromises) {
                        each.cancel()
                    }
                    scheduledPromises.length = 0
                    returnFunc.timeoutId = null
                    returnFunc.lastExecutionTime = Date.now()
                    if (promiseToResolve) {
                        promiseToResolve.resolve(func(...returnFunc.scheduledArgs))
                    }
                }, delay)
            }
        }
    }
    returnFunc.delay = delay
    returnFunc.scheduledArgs = []
    returnFunc.timeoutId = null
    returnFunc.lastExecutionTime = 0
    return returnFunc
}