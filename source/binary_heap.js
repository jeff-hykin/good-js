// bundled/formatted from the following import (MIT License)
// import {  ascend, descend, BinaryHeap } from "https://deno.land/std@0.192.0/collections/binary_heap.ts"

function ascend(a, b) {
    return a < b ? -1 : a > b ? 1 : 0
}
function descend(a, b) {
    return a < b ? 1 : a > b ? -1 : 0
}
export { ascend as ascend }
export { descend as descend }
function swap(array, a, b) {
    const temp = array[a]
    array[a] = array[b]
    array[b] = temp
}
function getParentIndex(index) {
    return Math.floor((index + 1) / 2) - 1
}
class BinaryHeap {
    compare
    #data
    constructor(compare = descend) {
        this.compare = compare
        this.#data = []
    }
    toArray() {
        return Array.from(this.#data)
    }
    static from(collection, options) {
        let result
        let unmappedValues = []
        if (collection instanceof BinaryHeap) {
            result = new BinaryHeap(options?.compare ?? collection.compare)
            if (options?.compare || options?.map) {
                unmappedValues = collection.#data
            } else {
                result.#data = Array.from(collection.#data)
            }
        } else {
            result = options?.compare ? new BinaryHeap(options.compare) : new BinaryHeap()
            unmappedValues = collection
        }
        const values = options?.map ? Array.from(unmappedValues, options.map, options.thisArg) : unmappedValues
        result.push(...values)
        return result
    }
    get length() {
        return this.#data.length
    }
    peek() {
        return this.#data[0]
    }
    pop() {
        const size = this.#data.length - 1
        swap(this.#data, 0, size)
        let parent = 0
        let right = 2 * (parent + 1)
        let left = right - 1
        while (left < size) {
            const greatestChild = right === size || this.compare(this.#data[left], this.#data[right]) <= 0 ? left : right
            if (this.compare(this.#data[greatestChild], this.#data[parent]) < 0) {
                swap(this.#data, parent, greatestChild)
                parent = greatestChild
            } else {
                break
            }
            right = 2 * (parent + 1)
            left = right - 1
        }
        return this.#data.pop()
    }
    push(...values) {
        for (const value of values) {
            let index = this.#data.length
            let parent = getParentIndex(index)
            this.#data.push(value)
            while (index !== 0 && this.compare(this.#data[index], this.#data[parent]) < 0) {
                swap(this.#data, parent, index)
                index = parent
                parent = getParentIndex(index)
            }
        }
        return this.#data.length
    }
    clear() {
        this.#data = []
    }
    isEmpty() {
        return this.#data.length === 0
    }
    *drain() {
        while (!this.isEmpty()) {
            yield this.pop()
        }
    }
    *[Symbol.iterator]() {
        yield* this.drain()
    }
}
export { BinaryHeap as BinaryHeap }
