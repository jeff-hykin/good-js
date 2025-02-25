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
 * const result = [...linearStepsIter({ start: 4, end: 31, quantity: 5, transform: Math.round })];
 * console.log(result);  // Output: [4, 11, 18, 24, 31]
 * ```
 */
export function* linearStepsIter({ start, end, quantity, transform = (x) => x }) {
    if (quantity <= -1) {
        throw new Error("Quantity must be greater than or equal to 0");
    }

    if (quantity !== 0) {
        quantity = Math.ceil(quantity);
        
        if (start === end) {
            for (let i = 0; i < quantity; i++) {
                yield transform(start);
            }
        } else {
            const x0 = 1;
            const x1 = quantity;
            const y0 = start;
            const y1 = end;

            const interpolater = (x) => (x1 - x0) === 0 ? y0 : y0 + (y1 - y0) / (x1 - x0) * (x - x0);
            
            for (let x = 0; x < quantity - 1; x++) {
                yield transform(interpolater(x + 1));
            }

            yield transform(end);
        }
    }
}