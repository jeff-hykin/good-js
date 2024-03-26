export function testCallJsonify(func, ...args) {
    const argsBefore = JSON.stringify(args)
    console.log(`args before: ${argsBefore}`)
    const result  = func(...args)
    if (result instanceof Promise) {
        return result.then(each=>{
            const argsAfter = JSON.stringify(args)
            if (argsBefore !== argsAfter) {
                console.log(`args after: ${argsAfter}`)
            } else {
                console.log(`[args were not changed]`)
            }
            console.log(`result: ${JSON.stringify(each)}`)
        })
    } else {
        const argsAfter = JSON.stringify(args)
        if (argsBefore !== argsAfter) {
            console.log(`args after: ${argsAfter}`)
        } else {
            console.log(`[args were not changed]`)
        }
        console.log(`result: ${JSON.stringify(result)}`)
    }
}