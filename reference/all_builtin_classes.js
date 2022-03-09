Function
AsyncFunction           //  doesnt have global name, use: Object.getPrototypeOf(async ()=>0)
AsyncGeneratorFunction  //  doesnt have global name, use: ((async function*(){})()).constructor
AsyncGenerator          //  doesnt have global name, use: Object.getPrototypeOf((async function*(){})())
Generator               //  doesnt have global name, use: Object.getPrototypeOf((function*(){}))
GeneratorFunction       //  doesnt have global name, use: ((function*(){})()).constructor
Promise

RegExp
Date

Error
EvalError
AggregateError
RangeError
ReferenceError
SyntaxError
TypeError
URIError

Uint16Array
Uint32Array
Uint8Array
Uint8ClampedArray
Int16Array
Int32Array
Int8Array
Float32Array
Float64Array
BigInt64Array
BigUint64Array

Array
Object
Map
Set
MapIterator  // doesnt have global name, use: Object.getPrototypeOf((new Map()).values()) // same class is used for .keys and .values
SetIterator  // doesnt have global name, use: Object.getPrototypeOf((new Set()).values())

ArrayBuffer
SharedArrayBuffer
DataView
FinalizationRegistry
WeakMap
WeakRef
WeakSet

// dont have global objects (at least in Deno):
InternalError
WebAssembly
TypedArray