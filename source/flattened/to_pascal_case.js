import { wordList } from "./word_list.js"

export const toPascalCase = (str) => {
    const words = wordList(str)
    const capatalizedWords = words.map(each=>each.replace(/^\w/, (group0)=>group0.toUpperCase()))
    return capatalizedWords.join('')
}