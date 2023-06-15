# good-js

My Generic Javascript Toolbox

```js
import DateTime from "https://deno.land/x/good@1.1.1.2/date.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.1.1.2/array.js"
import { intersection, subtract } from "https://deno.land/x/good@1.1.1.2/set.js"
import { stats, sum, spread, normalizeZeroToOne, roundedUpToNearest, roundedDownToNearest } from "https://deno.land/x/good@1.1.1.2/math.js"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase, toRepresentation, toString, escapeRegexMatch, escapeRegexReplace } from "https://deno.land/x/good@1.1.1.2/string.js"
import { generateKeys, encrypt, decrypt, hashers } from "https://deno.land/x/good@1.1.1.2/encryption.js"
import { deferredPromise, recursivePromiseAll } from "https://deno.land/x/good@1.1.1.2/async.js"
import { Event, trigger, everyTime, once } from "https://deno.land/x/good@1.1.1.2/events.js"
import { recursivelyAllKeysOf, get, set, remove, merge, compareProperty } from "https://deno.land/x/good@1.1.1.2/object.js"
import { deepCopy, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorType } from "https://deno.land/x/good@1.1.1.2/value.js"
import { iter, next, Stop, Iterable, zip, count, enumerate, permute, combinations, slices, asyncIteratorToList, concurrentlyTransform, forkAndFilter } from "https://deno.land/x/good@1.1.1.2/iterable.js"
import { parseCsv, createCsv } from "https://deno.land/x/good@1.1.1.2/csv.js"
```

## Versioning

`1.2.3.4`
- 1st number is API overhaul
- 2nd number is breaking change
- 3rd number is new (backwards compatible) feature 
- 4th number is patch/bugfix