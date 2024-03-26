export function testCallJsonify(func, ...args) {
    console.log()
    const argsBefore = JSON.stringify(args)
    console.log(`args before: ${argsBefore}`)
    let err
    let result
    try {
        result = func(...args)
    } catch (error) {
        err = error
    }
    if (result instanceof Promise) {
        return result.then(each=>{
            result = each
        }).catch(error=>{
            err = error
        }).finally(()=>{
            if (err) {
                console.log(`error: ${err}`)
            }
            const argsAfter = JSON.stringify(args)
            if (argsBefore !== argsAfter) {
                console.log(`args after: ${argsAfter}`)
            } else {
                console.log(`[args were not changed]`)
            }
            console.log(`result: ${JSON.stringify(result)}`)
        })
    } else {
        if (err) {
            console.log(`error: ${err}`)
        }
        const argsAfter = JSON.stringify(args)
        if (argsBefore !== argsAfter) {
            console.log(`args after: ${argsAfter}`)
        } else {
            console.log(`[args were not changed]`)
        }
        console.log(`result: ${JSON.stringify(result)}`)
    }
}