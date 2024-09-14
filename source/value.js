// Summary of all javascript (ECMA Script) types
    // 2022 ECMA Script reference: https://262.ecma-international.org/13.0/#sec-ecmascript-data-types-and-values
    // super primitives: (no attributes whatsoever)
        // undefined
        // null
    // primitives: (not instances of Object, but have attributes)
        // Boolean
        // Symbol
            // special value: Symbol.hasInstance
            // special value: Symbol.isConcatSpreadable
            // special value: Symbol.iterator
            // special value: Symbol.asyncIterator
            // special value: Symbol.match
            // special value: Symbol.matchAll
            // special value: Symbol.replace
            // special value: Symbol.search
            // special value: Symbol.species
            // special value: Symbol.split
            // special value: Symbol.toPrimitive
            // special value: Symbol.toStringTag
            // special value: Symbol.unscopables
        // Number
            // special value: Infinity
            // special value: -Infinity
            // special value: NaN
        // BigInt
        // String
    // base containers:
        // Object
        // Array
    // singulars: (e.g. non-containers, but are instanceof Object)
        // RegExp
        // Date
        // URL
        // in the future `Temporal` may be added here (as a fix for Date)
    // support: (used for internals, not really values directly)
        // Error
            // AggregateError
            // EvalError
            // RangeError
            // ReferenceError
            // SyntaxError
            // TypeError
            // URIError
        // Function
        // Promise
        // AsyncFunction, Note: not globally defined
        // SyncGeneratorFunction, Note: not globally defined
        // AsyncGeneratorFunction, Note: not globally defined
        // SyncGeneratorObject, Note: not offically named or globally defined
        // AsyncGeneratorObject, Note: not offically named or globally defined
    // extra containers:
        // Set
        // Map
        // WeakSet
        // WeakMap
        // URLSearchParams
    // iterators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator
        // IteratorPrototype, Note: not globally defined, https://262.ecma-international.org/7.0/#sec-%iteratorprototype%-object
        // SetIterator, Note: not globally defined
        // MapIterator, Note: not globally defined
        // TODO: the regex matchall iterator
    // typed arrays:
        // Int8Array
        // Int16Array
        // Int32Array
        // Uint8Array
        // Uint16Array
        // Uint32Array
        // Uint8ClampedArray
        // Float32Array
        // Float64Array
        // BigInt64Array
        // BigUint64Array
    // advanced (non-iterable):
        // ArrayBuffer
        // SharedArrayBuffer
        // DataView
        // WeakRef
        // FinalizationRegistry
    // weird not-types-but-kinda-feel-like-types
        // while AsyncFunction is type, generally any normal function that returns a promise is considered an async function (and they do not have that type)
        // arrow functions are not 
        // sync iteratables: any object with a valid [Symbol.iterator] method
        // async iterables: any object with a valid [Symbol.asyncIterator] method 
        // iterator: any object with a valid next() function, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
    
    // not ECMA Script but supported on at least Deno, NodeJS, and Firefox 
        // Request
        // Response
        // TextDecoder
        // TextEncoder
        // TextDecoderStream
        // TextEncoderStream
    
    // not ECMA Scipt
        // Worker
        // File
        // Blob
        // SubtleCrypto
        // Crypto
        // CryptoKey
        // PromiseRejectionEvent

    // Classes I havent verified yet
        //
        //         AbortController
        //         AbortSignal
        //
        //     NodeJS/Deno/Browser but probably not ECMA Script
        //
        //         Event
        //         EventTarget
        //
        //         Performance
        //         PerformanceEntry
        //         PerformanceMark
        //         PerformanceMeasure
        //
        //
        //
        //         ReadableByteStreamController
        //         ReadableStream
        //         ReadableStreamBYOBReader
        //         ReadableStreamBYOBRequest
        //         ReadableStreamDefaultController
        //         ReadableStreamDefaultReader
        //
        //         WritableStream
        //         WritableStreamDefaultController
        //         WritableStreamDefaultWriter
        //
        //         TransformStream
        //         TransformStreamDefaultController
        //         CompressionStream
        //         DecompressionStream
        //
        //         MessageChannel
        //         MessageEvent
        //         MessagePort
        //
        //         ByteLengthQueuingStrategy
        //         CountQueuingStrategy
        //
        //         DOMException
        //
        //         FormData
        //         Headers
        //
        //     Common but not on NodeJS
        //
        //         File
        //         FileReader
        //
        //         WebSocket
        //
        //         ProgressEvent
        //         CustomEvent
        //         CloseEvent
        //         ErrorEvent
        //
        //         Location
        //
        //         URLPattern
        //
        //         Navigator
        //
        //         SubtleCrypto
        //
        //     Uncommon
        //
        //         Cache
        //         CacheStorage
        //         Storage
        //         Window


// 
// nail down built-in classes
// 
    import { typedArrayClasses } from "./flattened/typed_array_classes.js"; export { typedArrayClasses as typedArrayClasses }
    import { builtInCopyablePrimitiveClasses as copyableClasses } from "./flattened/built_in_copyable_primitive_classes.js"; export { copyableClasses as copyableClasses }
    import { syncIteratorPrototype  } from "./flattened/sync_iterator_prototype.js";          export { syncIteratorPrototype as iteratorPrototype }
    import { ArrayIterator          } from "./flattened/array_iterator__class.js";            export { ArrayIterator as ArrayIterator }
    import { MapIterator            } from "./flattened/map_iterator__class.js";              export { MapIterator as MapIterator }
    import { SetIterator            } from "./flattened/set_iterator__class.js";              export { SetIterator as SetIterator }
    import { AsyncFunction          } from "./flattened/async_function__class.js";            export { AsyncFunction as AsyncFunction }
    import { SyncGeneratorFunction      } from "./flattened/sync_generator_function__class.js";        export { SyncGeneratorFunction as SyncGeneratorFunction }
    import { AsyncGeneratorFunction } from "./flattened/async_generator_function__class.js";  export { AsyncGeneratorFunction as AsyncGeneratorFunction }
    import { SyncGeneratorObject          } from "./flattened/sync_generator_object__class.js";            export { SyncGeneratorObject as SyncGeneratorObject }
    import { AsyncGeneratorObject         } from "./flattened/async_generator_object__class.js";           export { AsyncGeneratorObject as AsyncGeneratorObject }

// 
// checker functions
// 
    import { isPrimitive } from "./flattened/is_primitive.js"; export { isPrimitive as isPrimitive }
    import { isPureObject } from "./flattened/is_pure_object.js"; export { isPureObject as isPureObject }
    import { isPracticallyPrimitive } from "./flattened/is_practically_primitive.js"; export { isPracticallyPrimitive as isPracticallyPrimitive }
    import { isBuiltInSyncIterator } from "./flattened/is_built_in_sync_iterator.js"; export { isBuiltInSyncIterator as isBuiltInIterator }
    import { isGeneratorObject } from "./flattened/is_generator_object.js"; export { isGeneratorObject as isGeneratorObject }
    import { isAsyncIterable } from "./flattened/is_async_iterable.js"; export { isAsyncIterable as isAsyncIterable }
    import { isSyncIterable } from "./flattened/is_sync_iterable.js"; export { isSyncIterable as isSyncIterable }
    import { isIterableObjectOrContainer } from "./flattened/is_iterable_object_or_container.js"; export { isIterableObjectOrContainer as isIterableObjectOrContainer }
    import { isIterableTechnically } from "./flattened/is_iterable_technically.js"; export { isIterableTechnically as isIterableTechnically }
    import { isSyncIterableObjectOrContainer } from "./flattened/is_sync_iterable_object_or_container.js"; export { isSyncIterableObjectOrContainer as isSyncIterableObjectOrContainer }

// 
// deep copy
// 
    import { deepCopySymbol } from "./flattened/deep_copy_symbol.js"; export { deepCopySymbol as deepCopySymbol }
    import { deepCopy } from "./flattened/deep_copy.js"; export { deepCopy as deepCopy }
    import { shallowSortObject } from "./flattened/shallow_sort_object.js"; export { shallowSortObject as shallowSortObject }
    import { deepSortObject } from "./flattened/deep_sort_object.js"; export { deepSortObject as deepSortObject }
    import { stableStringify } from "./flattened/stable_stringify.js"; export { stableStringify as stableStringify }

// 
// object/value keys
// 
    import { allKeys } from "./flattened/all_keys.js"; export { allKeys as allKeys }
    import { allKeyDescriptions } from "./flattened/all_key_descriptions.js"; export { allKeyDescriptions as allKeyDescriptions }
    import { ownKeyDescriptions } from "./flattened/own_key_descriptions.js"; export { ownKeyDescriptions as ownKeyDescriptions }