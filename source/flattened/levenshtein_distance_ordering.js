import { levenshteinDistanceBetween } from "./levenshtein_distance_between.js"

/**
 * Sorts an array of words based on their Levenshtein distance to a target word.
 *
 * @param {Object} options - The options for sorting.
 * @param {string} options.word - The target word for calculating Levenshtein distances.
 * @param {string[]} options.otherWords - An array of words to be sorted.
 * @returns {string[]} The sorted array of words based on their Levenshtein distance to the target word.
 */
export function levenshteinDistanceOrdering({ word, otherWords }) {
    word = word.toLowerCase()
    let prioritized = [...otherWords].sort((a, b) => levenshteinDistanceBetween(word, a) - levenshteinDistanceBetween(word, b))
    return prioritized
}