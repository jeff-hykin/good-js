import { makeIterable } from "./make_iterable.js"

export const reversed = function (object) {
    // efficient string reverse
    if (typeof object == 'string') {
        // https://stackoverflow.com/a/48256861/4367134
        return object.split('').reduce((reversed, character) => character + reversed, '')
    }
    // make a copy, then reverse it
    return [...makeIterable(object)].reverse()
}