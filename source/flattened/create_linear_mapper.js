// TODO: function could be more efficient (distrubte the /fromRange)
export const createLinearMapper = (from={min:0, max:1}, to={min:0, max:100})=> {
    const fromRange = from.max - from.min
    const toRange = to.max - to.min
    return (value) => {
        const normalized = (value - from.min)/fromRange
        const newMapping = (normalized * toRange) + to.min
        return newMapping
    }
}