import { version } from "../flattened/version.js"

// isGreaterThan tests
console.log("version`1.2.3.5`.isGreaterThan(`1.2.3.4`)", version`1.2.3.5`.isGreaterThan(`1.2.3.4`))
console.log("version`2.0.0`.isGreaterThan(`1.9.9.9`)", version`2.0.0`.isGreaterThan(`1.9.9.9`))
console.log("!version`1.2.3`.isGreaterThan(`1.2.3.0`)", !version`1.2.3`.isGreaterThan(`1.2.3.0`))

// isLessThan tests
console.log("version`1.2.3`.isLessThan(`1.2.4`)", version`1.2.3`.isLessThan(`1.2.4`))
console.log("version`0.9.9`.isLessThan(`1.0.0`)", version`0.9.9`.isLessThan(`1.0.0`))
console.log("!version`2.0.0`.isLessThan(`1.9.9.9`)", !version`2.0.0`.isLessThan(`1.9.9.9`))

// isEqualTo tests
console.log("version`1.2.3`.isEqualTo(`1.2.3`)", version`1.2.3`.isEqualTo(`1.2.3`))
console.log("version`1.2.3.0`.isEqualTo(`1.2.3`)", version`1.2.3.0`.isEqualTo(`1.2.3`))
console.log("!version`1.2.3`.isEqualTo(`1.2.3.1`)", !version`1.2.3`.isEqualTo(`1.2.3.1`))

// Mixed comparison tests
console.log("version`2.0.0`.isGreaterThan(`1.9.9`) && !version`2.0.0`.isLessThan(`1.9.9`)", version`2.0.0`.isGreaterThan(`1.9.9`) && !version`2.0.0`.isLessThan(`1.9.9`))
console.log("version`1.0.0`.isLessThan(`1.0.1`) && !version`1.0.0`.isGreaterThan(`1.0.1`)", version`1.0.0`.isLessThan(`1.0.1`) && !version`1.0.0`.isGreaterThan(`1.0.1`))
console.log("version`3.3.3`.isEqualTo(`3.3.3`) && !version`3.3.3`.isGreaterThan(`3.3.3`) && !version`3.3.3`.isLessThan(`3.3.3`)", version`3.3.3`.isEqualTo(`3.3.3`) && !version`3.3.3`.isGreaterThan(`3.3.3`) && !version`3.3.3`.isLessThan(`3.3.3`))

// Mixed comparison tests
console.log(version`2.0.0`.is({greaterThan:`1`, lessThan: `3`}))
console.log(version`1.0.0`.is({lessThan:`1.12.0`, greaterThan: `1.0.1`}))
console.log(version`3.3.3`.is({equalTo:`3.3.3`, greaterThan: `3.3.3`}))

// More digits
console.log(version`1.2.3.4.5`.isGreaterThan(`1.2.3.4.4`), "1.2.3.4.5  greater than 1.2.3.4.4")
console.log(version`10.0.0.0.0`.isGreaterThan(`9.9.9.9.9`), "10.0.0.0.0  greater than 9.9.9.9.9")

// Fewer digits
console.log(version`1.2`.isLessThan(`1.2.1`), "1.2  less than 1.2.1")
console.log(version`2`.isGreaterThan(`1.9.9.9`), "2  greater than 1.9.9.9")

// Prefix text
console.log(version`v1.2.3`.isEqualTo(`1.2.3`), "v1.2.3  equal to 1.2.3")
console.log(version`release-2.0.0`.isGreaterThan(`1.9.9`), "release-2.0.0  greater than 1.9.9")

// Postfix text
console.log(version`1.2.3-alpha`.isLessThan(`1.2.3`), "1.2.3-alpha  less than 1.2.3")
console.log(version`2.0.0-rc.1`.isGreaterThan(`1.9.9`), "2.0.0-rc.1  greater than 1.9.9")

// Combination of prefix and postfix
console.log(version`v1.2.3-beta`.isLessThan(`v1.2.3-rc`), "v1.2.3-beta  less than v1.2.3-rc")
console.log(version`release-3.0.0-final`.isGreaterThan(`release-2.9.9`), "release-3.0.0-final  greater than release-2.9.9")

// Mixed comparisons with different formats
console.log(version`v2.0`.isGreaterThan(`1.9.9.9`) && version`v2.0`.isLessThan(`2.0.1`), "v2.0  greater than 1.9.9.9 and less than 2.0.1")
console.log(version`1.0.0-rc.1`.isLessThan(`1.0.0`) && version`1.0.0-rc.1`.isGreaterThan(`1.0.0-beta`), "1.0.0-rc.1  less than 1.0.0 and greater than 1.0.0-beta")
