export const isEmptyObject = (object) => {
    if (object == null) {
        return true
    }
    for (const _ in object) {
        return false
    }
    return true
}