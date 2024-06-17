/**
 *
 * @param {String[]} array - a list of strings
 * @param {String[]} defaultValue - the "value" in key-value
 * @return {Object} an object with all keys set
 *
 * @example
 *     ```js
 *     const keys = ["thing1", "thing2"]
 *     const obj = arrayOfKeysToObject(keys)
 *     // obj == { "thing1": undefined, "thing2": undefined }
 *     ```
 */
export const arrayOfKeysToObject = (array, defaultValue)=>array.reduce((acc,curr)=> (acc[curr]=defaultValue,acc),{})