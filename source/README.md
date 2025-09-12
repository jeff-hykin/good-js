# good-js

A standard library of tools missing from JavaScript. Works for any ECMA Script runtime (2016 or later).

```js
import DateTime from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/date.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/array.js"
import { intersection, subtract } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/set.js"
import { stats, sum, spread, normalizeZeroToOne, roundedUpToNearest, roundedDownToNearest } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/math.js"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingKebabCase, toScreamingSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix, didYouMean } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/string.js"
import { generateKeys, encrypt, decrypt, hashers } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/encryption.js"
import { deferredPromise, recursivePromiseAll } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/async.js"
import { Event, trigger, everyTime, once } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/events.js"
import { recursivelyOwnKeysOf, get, set, hasKeyList, hasDirectKeyList, remove, merge, compareProperty, recursivelyIterateOwnKeysOf } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/object.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/value.js"
import { iter, next, stop, Iterable, map, filter, reduce, frequencyCount, zip, count, enumerate, permute, combinations, slices, asyncIteratorToList, concurrentlyTransform, forkBy } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/iterable.js"
import { parseCsv, createCsv } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/csv.js"
import { BinaryHeap } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/binary_heap.js"
import { parseArgs } from "https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/flattened/parse_args.js"
```


# How to use

Use intellisense, view [the docs](https://esm.sh/gh/jeff-hykin/good-js?doc), or source/take a look at the [tests](https://github.com/jeff-hykin/good-js/tree/master/tests) for how to use

## Versioning

`1.2.3.4`
- 1st number is API overhaul
- 2nd number is breaking change
- 3rd number is new (backwards compatible) feature 
- 4th number is patch/bugfix