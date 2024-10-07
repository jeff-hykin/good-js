import { extractFirst } from "./extract_first.js"
import { iterZipLongSync as zip } from "./iter_zip_long_sync.js"
import { toRepresentation } from "./to_representation.js"

export class VersionClass extends Array {
    constructor(version) {
        super()
        if (version instanceof VersionClass) {
            for (const each of version) {
                this.push(each)
            }
            this.prefix = version.prefix
            this.postFix = version.postFix
            return
        }
        if (typeof version != "string") {
            throw Error(`Version must be a string, not ${typeof version}`)
        }
        var remaining = version.trim()
        var { remaining, extraction: prefix, } = extractFirst({ pattern: /^[^0-9]*/, from: remaining })
        this.prefix = prefix
        let matchedSomething = true
        while (matchedSomething) {
            var { remaining, extraction: numberString, } = extractFirst({ pattern: /^(\d+)\./, from: remaining })
            matchedSomething = !!numberString
            if (matchedSomething) {
                this.push(numberString-0)
            }
        }
        var { remaining, extraction: finalNumber, } = extractFirst({ pattern: /^(\d+)/, from: remaining })
        if (finalNumber) {
            this.push(finalNumber-0)
        }
        this.postFix = remaining
    }
    get major() {
        return this[0] ?? 0
    }
    get minor() {
        return this[1] ?? 0
    }
    get patch() {
        return this[2] ?? 0
    }
    set major(value) {
        return this[0] = value
    }
    set minor(value) {
        return this[1] = value
    }
    set patch(value) {
        return this[2] = value
    }
    toString() {
        return `${this.prefix}${this.join(".")}${this.postFix}`
    }
    isAtLeast(other) {
        return this.largerThanCompare(other) >= 0
    }
    isGreaterThan(other)          { return this.largerThanCompare(other) > 0   }
    isLessThan(other)             { return this.largerThanCompare(other) < 0   }
    isEqualTo(other)              { return this.largerThanCompare(other) === 0 }
    isGreaterThanOrEqualTo(other) { return this.largerThanCompare(other) >= 0  }
    isLessThanOrEqualTo(other)    { return this.largerThanCompare(other) <= 0  }
    is({ greaterThan, lessThan, equalTo, greaterThanOrEqualTo, lessThanOrEqualTo, ...other }) {
        const options = { greaterThan, lessThan, equalTo, greaterThanOrEqualTo, lessThanOrEqualTo, }
        if (Object.keys(other).length > 0) {
            throw Error(`Unknown options: ${Object.keys(other).join(", ")}\n should be one of ${JSON.stringify(Object.keys(options))}`)
        }
        let failed = false
        for (const [key, value] of Object.entries(options)) {
            if (value != undefined) {
                if (!this[`is${key[0].toUpperCase()}${key.slice(1,)}`](value)) {
                    return false
                }
            }
        }
        return true
    }
    largerThanCompare(other) {
        if (typeof other == "string") {
            other = new VersionClass(other)
        } else if (!(other instanceof Array)) {
            throw Error(`When comparing versions version\`1.2.3\`.largerThanCompare(other) the other must be a string, version, or array. Instead got ${toRepresentation(other)}`)
        }
        for (let [thisNumber, otherNumber] of zip(this, other)) {
            thisNumber = thisNumber||0
            otherNumber = otherNumber||0
            if (thisNumber > otherNumber) {
                return 1
            } else if (thisNumber < otherNumber) {
                return -1
            }
        }
        if (!this.postFix && other.postFix) {
            return 1
        } else if (this.postFix && !other.postFix) {
            return -1
        }
        return 0
    }
}

/**
 * Creates a new `VersionClass` instance from the provided arguments.
 *
 * @example
 * ```js
 * import { version } from "https://deno.land/x/good/flattened/version.js"
 * // true
 * version`2.0.0`.isGreaterThan(`1.9.9.9`)
 * version`2.0.0`.isGreaterThan(`v1.9.9.9`)
 * version`2.0.0`.is({ greaterThan:`1.9.9.9`, lessThan: `3` })
 * // true
 * version`1.0.0-rc.1`.isLessThan(`1.0.0`)
 * version`1.0.0-rc.1`.isLessThan(version`1.0.0`)
 * ```
 * @param {string} arg
 * @returns {VersionClass} A new `VersionClass` instance representing the provided version.
 */
export function version(maybeStrings, ...args) {
    // 
    // template support
    // 
    let asStringArg
    const isTemplateCallProbably = maybeStrings instanceof Array && maybeStrings.length-1 == args.length
    if (isTemplateCallProbably) {
        const chunks = []
        let index = -1
        for (const each of args) {
            index++
            chunks.push(maybeStrings[index])
            chunks.push(each)
        }
        chunks.push(maybeStrings[index+1])
        asStringArg = chunks.join("")
    }
    return new VersionClass(asStringArg||maybeStrings)
}