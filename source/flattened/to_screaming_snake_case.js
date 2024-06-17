import { wordList } from "./word_list.js"

export const toScreamingSnakeCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toUpperCase()).join('_')
}