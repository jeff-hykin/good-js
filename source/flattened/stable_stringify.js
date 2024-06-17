export const stableStringify = (value, ...args) => {
    return JSON.stringify(deepSortObject(value), ...args)
}