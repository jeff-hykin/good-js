/**
 * Checks type according to English
 *
 * @param {Object} args.value - any possible value 
 * @param {Object} args.is - a class or string-description Object, Array, null, "nullish", "number", Number, Boolean, Function
 * @return {Boolean} the legitmate/intuitive answer
 * 
 * @note
 *     Object means can-be-a JSON-object
 * 
 * @example
 *     checkIf({value: undefined , is: null     }) // false
 *     checkIf({value: undefined , is: String   }) // false
 *     checkIf({value: undefined , is: 'nullish'}) // true
 *     checkIf({value: null      , is: 'nullish'}) // true
 *     checkIf({value: NaN       , is: 'nullish'}) // true
 *     checkIf({value: null      , is: Object   }) // false
 *     checkIf({value: NaN       , is: NaN      }) // true!
 *     checkIf({value: NaN       , is: Number   }) // false!
 *     checkIf({value: ("string"), is: Object   }) // false
 *     checkIf({value: {blah: 10}, is: Object   }) // true!
 *     checkIf({value: new Date(), is: Object   }) // false!
 *     checkIf({value: new CustomClass()         , is: Object}) // true!
 *     checkIf({value: ()=>{return "imma func"}  , is: Object}) // false
 *     checkIf({value: ["I", "am", "an", "array"], is: Object}) // false
 *     checkIf({value: new CustomClass()         , is: Date})   // false
 */
export const checkIf = ({ value, is }) => {
    let typeOrClass = is 
    // 
    // Check typeOrClass
    // 
    // see if typeOrClass is actually a class 
    if (typeof typeOrClass == 'function') {
        typeOrClass = typeOrClass.name
    }
    // lowercase any string-names
    if (typeof typeOrClass == 'string') {
        typeOrClass = typeOrClass.toLowerCase()
    }

    //
    // Strict Values
    //
    // object (non-null, non-function, non-array)
    if (typeOrClass === "object") {
        if (!(value instanceof Object)) {
            return false
        } else if (value instanceof Array || value instanceof Function || value instanceof Date) {
            return false
        // check if its stringified+parsed form is also an object 
        // (this is to remove things like BigInt and BigInt64Array and other built-in pseudo-primitives)
        } else {
            let stringified = JSON.stringify(value)
            // note that this is not == '"undefined"'
            if (stringified === 'undefined') {
                return false
            } else if (JSON.parse(stringified) instanceof Object) {
                return true
            } else {
                return false
            }
        }
    }
    // undefined
    else if (typeof typeOrClass === 'undefined' || typeOrClass == 'undefined') {
        return typeof value === 'undefined'
    }
    // null
    else if (typeOrClass === null || typeOrClass == 'null') {
        return value === null
    }
    // NaN
    else if ((typeOrClass !== typeOrClass && typeof typeOrClass == 'number') || typeOrClass == 'nan') {
        return value !== value && typeof value == 'number'
    }
    // false
    else if (typeOrClass === false) {
        return value === false
    }
    // true
    else if (typeOrClass === true) {
        return value === true
    }
    // bool
    else if (typeOrClass === "bool" || typeOrClass === "boolean") {
        return value === true || value === false
    }
    // empty string
    else if (typeOrClass === "") {
        return value === ""
    }
    // empty list
    else if (typeOrClass === "[]" || Array.isArray(typeOrClass) && typeOrClass.length == 0) {
        return value instanceof Array && value.length == 0
    }
    // function
    else if (typeOrClass === "function") {
        return typeof value == "function"
    }
    // number
    else if (typeOrClass == "number" || typeOrClass == Number) {
        if (value !== value) {
            return false
        }
        else {
            return typeof value == "number" || value instanceof Number
        }
    }
    // string
    else if (typeOrClass == "string") {
        return typeof value == "string" || value instanceof String
    }
    // array
    else if (typeOrClass == "array") {
        return value instanceof Array
    }
    // symbol
    else if (typeOrClass == "symbol") {
        return typeof value == "symbol"
    }

    // 
    // Unstrict values
    // 
    // nullish (null, undefined, NaN)
    else if (typeOrClass === 'nullish') {
        return value == null || value !== value
    }
    // emptyish ({},[],"",null,undefined)
    else if (typeOrClass === 'emptyish') {
        if ((value instanceof Array && value.length == 0) || value === "" || value == null) {
            return true
        }
        else if (value instanceof Object) {
            return Object.keys(value).length == 0
        }
        else {
            return false
        }
    }
    // falsey ("0",0,false,null,undefined,NaN)
    else if (typeOrClass === 'falsey' || typeOrClass === 'falsy' || typeOrClass === 'falseish' || typeOrClass === 'falsish') {
        return value == null || value === false || value !== value || value === 0 || value === "0"
    }
    // falsey-or-empty ({},[],"","0",0,false,null,undefined,NaN)
    else if (typeOrClass === 'falsey-or-empty' || typeOrClass === 'falsy-or-empty' || typeOrClass === 'falseish-or-empty' || typeOrClass === 'falsish-or-empty') {
        // empty array
        if (value instanceof Array && value.length == 0) {
            return true
        }
        // empty object
        else if (value instanceof Object) {
            return Object.keys(value).length == 0
        }
        else {
            return (value ? true : false)
        }
    }
    // numberish 
    else if (typeOrClass == 'numberish') {
        return (value != value) || !isNaN(value - 0)
    }
    // 
    // class type
    // 
    else if (aClass) {
        // if no constructor
        if (value === null || value === undefined) {
            return false
        }
        else {
            // see if constructors match
            if (value.constructor.name === typeOrClass) {
                return true
            }
            // check instanceof 
            else {
                return value instanceof aClass
            }
        }
    }
    // 
    // failed to recognize
    // 
    else {
        throw new Error(`when you call checkIf(), I'm not recoginizing the type or class: ${typeOrClass}`)
    }
}

/**
 * Throws error if type requirement isn't met
 *
 * @param {Object} args.value - any possible value 
 * @param {Object} args.is - a class or string-description Object, Array, null, "nullish", "number", Number, Boolean, Function
 * @param {string} args.failMessage - a string to be added to the top of the error message
 * @return {undefined}
 * 
 * 
 * @example
 * // see checkIf() for more argument examples
 * requireThat({
 *     value: arg1.size,
 *     is: Number,
 *     failMessage: "The size of the first argument needs to be a number"
 * })
 */
export const requireThat = ({ value, is, failMessage }) => {
    if (!checkIf({ value, is})) {
        let requiredType = (is instanceof Object) ? is.prototype.constructor.name : is
        // 
        // figure out the real type of the object
        // 
        let actualType
        if (value instanceof Object) {
            actualType = value.constructor.prototype.constructor.name
        } else {
            if (value !== value) {
                actualType = "NaN"
            } else if (value === null) {
                actualType = "null"
            } else {
                actualType = typeof value
            }
        }
        failMessage = failMessage ? `Error Message: ${failMessage}` : ""
        throw Error(`Failed to pass a type check created by requireThat()\n    the value is considered to be: ${actualType}\n    which fails to meet the requirement of: ${requiredType}\n    the failing value is: ${value}\n\n${failMessage}`)
    }
}