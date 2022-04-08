export class Event extends Set {}
export const trigger = async (event, ...args)=>Promise.all([...event].map(each=>each(...args)))
export const everyTime = (event)=>({ then:(action)=>event.add(action) })
export const once = (event)=>({ then:(action)=>{
    let selfRemovingRanFirst = false
    let output, error
    let resolve, reject
    const handleReturn = ()=> error ? reject(error) : resolve(output)
    const selfRemoving = async (...args)=>{
        event.delete(selfRemoving)
        try {
            output = await action(...args)
        } catch (err) {
            error = err
        }
        selfRemovingRanFirst = true
        // if promise ran before it had access to output/error
        // (and therefore couldnt handle the return)
        // then this function needs to handle the return
        if (resolve) {
            handleReturn()
        }
    }
    event.add(selfRemoving)
    return new Promise((res, rej)=> {
        resolve = res
        reject = rej
        // if selfRemoving finished before it had access to resolve/reject
        // then the promise needs to handle the return
        if (selfRemovingRanFirst) {
            handleReturn()
        }
    })
}})