import { levenshteinDistanceBetween } from "./levenshtein_distance_between.js"

export class DidYouMeanError extends Error {
    constructor(arg, word, possibleWords) {
        super(arg)
        this.word = word
        this.possibleWords = possibleWords
    }
}

/**
 * Determines possible correct spellings for a given word based on a list of possible words.
 *
 * @example
 * ```js
 * const possibleWords = [ "length", "size", "blah", "help", ]
 * const badArg = "hep"
 *
 * // manual check
 * if (!possibleWords.includes(badArg)) {
 *   const suggestions = didYouMean({ givenWord: badArg, possibleWords }).join(", ")
 *   throw new Error(`${badArg} isn't a valid argument, did you mean one of ${suggestions}?`)
 * }
 *
 * // auto-throw (performs case-insensitive check)
 * didYouMean({ givenWord: badArg, possibleWords, autoThrow: true, suggestionLimit: 1 })
 * // >>> Error(`For "hep" did you "help"?`)
 *
 * // no suggestionLimit
 * didYouMean({ givenWord: badArg, possibleWords, autoThrow: true })
 * // >>> Error(`For "hep" did you mean one of [ "help", "size", "blah", "length", ]?`)
 *
 * ```
 *
 * @param {Object} options - The options for spell checking.
 * @param {string} options.givenWord - The word to be checked for possible corrections.
 * @param {string[]} options.givenWords - The words to be checked for possible corrections.
 * @param {string[]} options.possibleWords - An array of possible words to compare against.
 * @param {boolean} [options.caseSensitive=false] - Flag indicating whether the spell check should be case sensitive. Default is false.
 * @param {boolean} [options.autoThrow=false] - Flag for throwing automatically if the word is not a direct match
 * @param {number} [options.suggestionLimit=Infinity] - Number of results to return
 * @returns {string[]} An array of possible correct spellings for the given word.
 */
export function didYouMean(arg) {
    var { givenWord, givenWords, possibleWords, caseSensitive, autoThrow, suggestionLimit } = { suggestionLimit: Infinity, ...arg}
    if (givenWords instanceof Array) {
        let output = {}
        for (const givenWord of givenWords) {
            output[givenWord] = didYouMean({...arg, givenWord: givenWord, givenWords: undefined, })
        }
        return output
    }
    if (!caseSensitive) {
        possibleWords = possibleWords.map((each) => each.toLowerCase())
        givenWord = givenWord.toLowerCase()
    }
    if (!possibleWords.includes(givenWord) && autoThrow) {
        let suggestions = didYouMean({
            givenWord,
            possibleWords,
            caseSensitive,
            suggestionLimit,
        })
        if (suggestionLimit == 1 && suggestions.length > 0) {
            throw new DidYouMeanError(`For ${JSON.stringify(givenWord)}, did you mean ${JSON.stringify(suggestions[0])}?`, word, suggestions)
        } else {
            throw new DidYouMeanError(`For ${JSON.stringify(givenWord)}, did you mean one of ${JSON.stringify(suggestions)}?`, word, suggestions)
        }
    }
    // this distance metric could be swapped/improved in the future
    return [...possibleWords].sort((a, b) => levenshteinDistanceBetween(givenWord, a) - levenshteinDistanceBetween(givenWord, b)).slice(0, suggestionLimit)
}