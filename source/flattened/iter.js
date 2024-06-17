import { makeIterable } from './make_iterable.js'

export const iter = (object)=>{
    const iterable = makeIterable(object)
    if (iterable[Symbol.asyncIterator]) {
        return iterable[Symbol.asyncIterator]()
    } else {
        return iterable[Symbol.iterator]()
    }
}