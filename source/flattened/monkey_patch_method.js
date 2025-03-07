/**
 * patch a method, without breaking "this" behavior, similar to a decorator
 *
 * @example
 * ```js
 * // Example:
 * const obj = {
 *     thisName: 'Bob',
 *     greet(name) {
 *         return `Hello, ${name}!\n - from: ${this.thisName}`;
 *     }
 * };
 *
 * // Wrap the greet function to log the greeting before returning it
 * monkeyPatchMethod(obj, 'greet', (originalGreet) => {
 *     return function(...args) {
 *         console.log(`Calling greet with args: ${args}`);
 *         const result = originalGreet(...args);
 *         console.log(`Result: ${result}`);
 *         return result;
 *     };
 * });
 *
 * // After patching, the greet method logs the arguments and result
 * obj.greet('Alice');
 * // Console:
 * // Calling greet with args: [ 'Alice' ]
 * // Result: Hello, Alice!
 * // - from: Bob
 * ```
 * @param {Object} object - The object whose method is to be patched.
 * @param {string} attrName - The name of the method to patch.
 * @param {Function} createNewFunction - A function that takes the original function and 
 *                                       returns a new function that will replace the original.
 * @throws {Error} If the specified method does not exist in the object or its prototype chain.
 * 
 */ 
export function monkeyPatchMethod(object, attrName, createNewFunction) {
    let prevObj = null
    while (!Object.getOwnPropertyNames(object).includes(attrName)) {
        prevObj = object
        object = Object.getPrototypeOf(object)
        if (prevObj === object) {
            throw new Error(`Could not find ${attrName} on ${object}`)
        }
    }
    const originalFunction = object[attrName]
    let theThis
    const wrappedOriginal = function(...args) {
        return originalFunction.apply(theThis, args)
    }
    const innerReplacement = createNewFunction(wrappedOriginal)
    object[attrName] = function(...args) {
        theThis = this
        return innerReplacement.apply(this, args)
    }
}