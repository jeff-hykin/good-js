// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
export function escapeRegexReplace(string) {
    return string.replace(/\$/g, '$$$$')
}