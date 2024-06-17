export async function asyncIteratorToList(asyncIterator) {
        const results = []
        for await (const each of asyncIterator) {
            results.push(each)
        }
        return results
    }