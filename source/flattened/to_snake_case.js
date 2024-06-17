import { wordList } from "./word_list.js"

export const toSnakeCase = (str) => {
    const words = wordList(str)
    return words.map(each=>each.toLowerCase()).join('_')
}