export function randomlyShuffle(arr) {
    for (let index = arr.length - 1; index > 0; index--) {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * (index + 1))

        // Swap elements at index index and randomIndex
        ;[arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]]
    }
    return arr
}