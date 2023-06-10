# good-js

My Generic Javascript Toolbox

```js
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@0.7.11/array.js"
import { intersection, subtract } from "https://deno.land/x/good@0.7.11/set.js"
import { stats, sum, spread, normalizeZeroToOne, roundedUpToNearest, roundedDownToNearest } from "https://deno.land/x/good@0.7.11/math.js"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase, toRepresentation, toString } from "https://deno.land/x/good@0.7.11/string.js"
import DateTime from "https://deno.land/x/good@0.7.11/date.js"
import { generateKeys, encrypt, decrypt, hashers } from "https://deno.land/x/good@0.7.11/encryption.js"
import { Event, trigger, everyTime, once } from "https://deno.land/x/good@0.7.11/events.js"
import { recursivelyAllKeysOf, get, set, remove, merge, compareProperty } from "https://deno.land/x/good@0.7.11/object.js"
import { deepCopy, allKeyDescriptions, deepSortObject, shallowSortObject } from "https://deno.land/x/good@0.7.11/value.js"
import {makeIterable, map, filter, zip, count, enumerate, permute, combinations, slices, asyncIteratorToList, concurrentlyTransform} from "https://deno.land/x/good@0.7.11/iterable.js"
```