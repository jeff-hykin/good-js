export class Event extends Set {}
export const trigger = async (event, ...args)=>Promise.all([...event].map(each=>each(...args)))
export const everyTime = (event)=>({ then:(action)=>event.add(action) })
export const once = (event)=>{
    let selfRemovingRanFirst = false
    let output
    let resolve
    const selfRemoving = async (...args)=>{
        event.delete(selfRemoving)
        output = args
        selfRemovingRanFirst = true
        // if promise ran before it had access to output
        // (and therefore couldnt handle the return)
        // then this function needs to handle the return
        if (resolve) {
            resolve(output)
        }
    }
    event.add(selfRemoving)
    return new Promise(res=>{
        resolve = res
        // if selfRemoving finished before it had access to resolve/reject
        // then the promise needs to handle the return
        if (selfRemovingRanFirst) {
            resolve(output)
        }
    })
}