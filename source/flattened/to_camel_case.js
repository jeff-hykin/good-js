import { wordList } from "./word_list.js"

export const toCamelCase = (str) => {
    const words = wordList(str)
    const capatalizedWords = words.map(each=>each.replace(/^\w/, (group0)=>group0.toUpperCase()))
    // make the first one lowercase
    if (capatalizedWords.length > 0) {
        capatalizedWords[0] = capatalizedWords[0].toLowerCase()
    }
    return capatalizedWords.join('')
}