# good-js

A standard library of tools missing from JavaScript. Works for any ECMA Script runtime (2016 or later).

```js
import DateTime from "https://deno.land/x/good@1.6.1.2/date.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.6.1.2/array.js"
import { intersection, subtract } from "https://deno.land/x/good@1.6.1.2/set.js"
import { stats, sum, spread, normalizeZeroToOne, roundedUpToNearest, roundedDownToNearest } from "https://deno.land/x/good@1.6.1.2/math.js"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix, didYouMean } from "https://deno.land/x/good@1.6.1.2/string.js"
import { generateKeys, encrypt, decrypt, hashers } from "https://deno.land/x/good@1.6.1.2/encryption.js"
import { deferredPromise, recursivePromiseAll } from "https://deno.land/x/good@1.6.1.2/async.js"
import { Event, trigger, everyTime, once } from "https://deno.land/x/good@1.6.1.2/events.js"
import { recursivelyOwnKeysOf, get, set, hasKeyList, hasDirectKeyList, remove, merge, compareProperty, recursivelyIterateOwnKeysOf } from "https://deno.land/x/good@1.6.1.2/object.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorType,isAsyncIterable, isSyncIterable, isTechnicallyIterable, isSyncIterableObjectOrContainer, allKeys } from "https://deno.land/x/good@1.6.1.2/value.js"
import { iter, next, Stop, Iterable, map, filter, reduce, frequencyCount, zip, count, enumerate, permute, combinations, slices, asyncIteratorToList, concurrentlyTransform, forkBy } from "https://deno.land/x/good@1.6.1.2/iterable.js"
import { parseCsv, createCsv } from "https://deno.land/x/good@1.6.1.2/csv.js"
import { BinaryHeap } from "https://deno.land/x/good@1.6.1.2/binary_heap.js"
import { parseArgs } from "https://deno.land/x/good@1.6.1.2/flattened/parse_args.js"
```


# How to use

Use intellisense, view [the docs](https://deno.land/x/good?doc), or take a look at the [tests](https://github.com/jeff-hykin/good-js/tree/master/tests) for how to use

## Versioning

`1.2.3.4`
- 1st number is API overhaul
- 2nd number is breaking change
- 3rd number is new (backwards compatible) feature 
- 4th number is patch/bugfix