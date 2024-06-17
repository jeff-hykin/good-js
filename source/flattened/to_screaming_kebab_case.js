import { wordList } from "./word_list.js"

export const toScreamingKebabCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toUpperCase()).join('-')
}