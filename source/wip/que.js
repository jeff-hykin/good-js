class Que extends Array {
    static intialCapacity = 100
    #head = 0
    #tail = 0
    #length = 0
    #currentSize = 0
    #super = null
    constructor(items, intialCapacity) {
        this.#head = 0
        this.#tail = 0
        this.#length = 0
        this.#currentSize = typeof initialCapacity === undefined ? initialCapacity : Que.initialCapacity
        this.#super = Object.getPrototypeOf(Object.getPrototypeOf(this))
        this.length = this.#currentSize
        for (const each of items) {
            this.push(each)
        }
    }

    push(element) {
        if (this.#length == this.#currentSize) {
            this.#doubling()
        }
        this.#container[this.#tail] = element
        this.#length++
        this.#tail++
        if (this.#tail == this.#currentSize) {
            this.#tail = 0
        }
    }
    
    shift() {
        if (this.#length === 0) {
            throw new EmptyQueueException()
        }
        const tmp = this.#container[this.#head]
        this.#head++
        this.#length--
        if (this.#head == this.#currentSize) {
            this.#head = 0
        }
        if (this.#length == this.#currentSize / 4 && this.#length > initialCapacity) {
            this.#shrink()
        }
        return tmp
    }
    
    front() {
        if (this.#length === 0) {
            throw new EmptyQueueException()
        }
        return this.#container[this.#head]
    }

    get length() {
        return this.#length
    }
    set length(value) {
        while (value-- > 0) {
            this.shift()
        }
    }

    isEmpty() {
        return this.#length === 0
    }

    #doubling() {
        var currentSource = this.#head
        var currentTarget = 0
        const newContainer = Array(2 * this.#currentSize)

        while (currentTarget < this.#currentSize) {
            newContainer[currentTarget] = this.#container[currentSource]
            currentSource++
            currentTarget++
            if (currentSource == this.#currentSize) {
                currentSource = 0
            }
        }
        this.#container = newContainer
        this.#head = 0
        this.#tail = this.#currentSize
        this.#currentSize *= 2
    }

    #shrink() {
        var currentSource = this.#head
        var currentTarget = 0
        var newContainer = []
        newContainer.length = this.#currentSize / 4

        while (currentTarget < this.#currentSize) {
            newContainer[currentTarget] = this.#container[currentSource]
            currentSource++
            currentTarget++
            if (currentSource == this.#currentSize) {
                currentSource = 0
            }
        }
        this.#container = newContainer
        this.#head = 0
        this.#tail = this.#currentSize
        this.#currentSize /= 4
    }

    *[Symbol.iterator]() {
        for (let index = this.#tail; index > 0; index--) {
            yield this.#container[index]
        }
    }

    join(...args) {
        this.#container.slice(0,this.#length).join(...args)
    }
}


// custom:
//     length
//     shift
//     reverse
//     unshift
//     map
//     toReversed

// dont inherit:
//     toString
//     hasOwnProperty
//     constructor

// inherit:
//     findIndex
//     join
//     flatMap
//     findLast
//     keys
//     at
    



// findLastIndex
// slice
// entries
// every
// toSorted
// concat
// lastIndexOf
// sort
// values
// some
// toSpliced
// isPrototypeOf
// copyWithin
// pop
// splice
// forEach
// reduce
// with
// propertyIsEnumerable
// fill
// push
// includes
// filter
// reduceRight
// valueOf
// find

// indexOf
// flat
// toLocaleString
// propertyIsEnumerable



function EmptyQueueException() {
    this.message = "Operation cannot be done because queue is empty"
    this.name = "EmptyQueueException"
}
