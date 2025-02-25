import { linearStepsIter } from "./linear_steps_iter.js"

/**
 * Generates a sequence of values between `start` and `end` that are linearly spaced.
 * You can transform each value using the optional `transform` function, which can effectively allow some forms of logrithmic or exponential spacing.
 *
 * @param {Object} params - The parameters object.
 * @param {number} params.start - The starting value of the sequence.
 * @param {number} params.end - The ending value of the sequence.
 * @param {number} params.quantity - The number of values to generate (must be greater than or equal to 0).
 * @param {function} [params.transform=(x) => x] - Optional transform function to apply to each value (default is identity function).
 *
 * @returns {Generator} A generator that yields each value in the sequence.
 *
 * @example
 * ```js
 * // Example of using the linearSteps function
 * const result = linearSteps({ start: 4, end: 31, quantity: 5, transform: Math.round });
 * console.log(result);  // Output: [4, 11, 18, 24, 31]
 * ```
 */
export function linearSteps(...args) {
    return [...linearStepsIter(...args)]
}
