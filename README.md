# good-js

My Generic Javascript Toolbox

```js
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@0.7.18/array.js"
import { intersection, subtract } from "https://deno.land/x/good@0.7.18/set.js"
import { stats, sum, spread, normalizeZeroToOne, roundedUpToNearest, roundedDownToNearest } from "https://deno.land/x/good@0.7.18/math.js"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase, toRepresentation, toString } from "https://deno.land/x/good@0.7.18/string.js"
import DateTime from "https://deno.land/x/good@0.7.18/date.js"
import { generateKeys, encrypt, decrypt, hashers } from "https://deno.land/x/good@0.7.18/encryption.js"
import { deferredPromise, recursivePromiseAll } from "https://deno.land/x/good@0.7.18/async.js"
import { Event, trigger, everyTime, once } from "https://deno.land/x/good@0.7.18/events.js"
import { recursivelyAllKeysOf, get, set, remove, merge, compareProperty } from "https://deno.land/x/good@0.7.18/object.js"
import { deepCopy, allKeyDescriptions, deepSortObject, shallowSortObject } from "https://deno.land/x/good@0.7.18/value.js"
import {makeIterable, map, filter, zip, count, enumerate, permute, combinations, slices, asyncIteratorToList, concurrentlyTransform} from "https://deno.land/x/good@0.7.18/iterable.js"
```