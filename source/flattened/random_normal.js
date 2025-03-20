/**
 * random normal value using Box-Muller transform
 *
 * @example
 * ```js
 * console.log(randomNormal({mean: 0, std: 1}))
 * console.log(randomNormal({mean: 0, std: 1}))
 * console.log(randomNormal({mean: 0, std: 1}))
 * ```
 *
 * @param {Object} arg - 
 * @param {number} arg.mean - The mean of the normal distribution.
 * @param {number} arg.std - The standard deviation of the normal distribution.
 * @returns {number} - A random number drawn from a normal distribution.
 */
export function randomNormal({mean, std}) {
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return mean + z0 * std
}