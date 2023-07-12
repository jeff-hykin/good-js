// bundled/formatted from the following import (MIT License)
// import { CircularBuffer } from "https://deno.land/x/iterplus@v3.0.2.1/CircularBuffer.ts"

class CircularBuffer {
    start
    end
    data
    len
    constructor(init = [], capacity = 32) {
        let data = [...init]
        const totlen = data.length
        if (data.length < capacity) {
            data = data.concat(Array(capacity - data.length).fill(null))
        }
        this.data = data
        this.start = 0
        this.end = totlen % data.length
        this.len = totlen
    }
    size() {
        return this.len
    }
    capacity() {
        return this.data.length
    }
    get(ind) {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.")
        }
        return this.data[(this.start + ind) % this.data.length]
    }
    getEnd() {
        const size = this.size()
        if (size === 0) {
            throw new RangeError("Cannot get back of empty circular buffer.")
        }
        return this.data[(this.end - 1 + this.data.length) % this.data.length]
    }
    set(ind, val) {
        if (ind < 0 || ind >= this.size()) {
            throw new RangeError("Index out of bounds.")
        }
        this.data[(this.start + ind) % this.data.length] = val
    }
    setEnd(val) {
        const size = this.size()
        if (size === 0) {
            throw new RangeError("Cannot set back of empty circular buffer.")
        }
        this.data[(this.end - 1 + this.data.length) % this.data.length] = val
    }
    *[Symbol.iterator]() {
        for (let i = this.start; i != this.end; i = (i + 1) % this.data.length) {
            yield this.data[i]
        }
    }
    toArray() {
        if (this.start <= this.end) {
            return this.data.slice(this.start, this.end)
        }
        if (this.end === 0) {
            return this.data.slice(this.start)
        }
        return this.data.slice(this.start).concat(this.data.slice(0, this.end))
    }
    resizeTo(capacity) {
        const newData = new Array(capacity)
        let i = 0
        for (const elem of this) {
            newData[i] = elem
            i++
        }
        this.start = 0
        this.end = i
        this.data = newData
    }
    possiblyExpand() {
        if (this.size() >= this.data.length - 1) {
            this.resizeTo(this.data.length * 2)
        }
    }
    possiblyShrink() {
        if (this.size() * 4 <= this.data.length) {
            this.resizeTo(Math.ceil(this.data.length / 2))
        }
    }
    pushEnd(val) {
        this.possiblyExpand()
        this.data[this.end] = val
        this.end = (this.end + 1) % this.data.length
        this.len++
    }
    pushStart(val) {
        this.possiblyExpand()
        this.start = (this.start - 1 + this.data.length) % this.data.length
        this.data[this.start] = val
        this.len++
    }
    popEnd() {
        if (this.size() == 0) {
            throw new RangeError("Index out of bounds.")
        }
        this.end = (this.end - 1 + this.data.length) % this.data.length
        const ret = this.data[this.end]
        this.possiblyShrink()
        this.len--
        return ret
    }
    popStart() {
        if (this.size() == 0) {
            throw new RangeError("Index out of bounds.")
        }
        const ret = this.data[this.start]
        this.start = (this.start + 1) % this.data.length
        this.possiblyShrink()
        this.len--
        return ret
    }
    clear() {
        this.start = 0
        this.end = 0
        this.len = 0
    }
}
export { CircularBuffer as CircularBuffer }