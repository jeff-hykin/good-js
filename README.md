# good-js

My Generic Javascript Toolbox

```js
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@0.7.8/array.js"
import { intersection, subtract } from "https://deno.land/x/good@0.7.8/set.js"
import { stats, sum, spread, normalizeZeroToOne, roundedUpToNearest, roundedDownToNearest } from "https://deno.land/x/good@0.7.8/math.js"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase, toRepresentation, toString } from "https://deno.land/x/good@0.7.8/string.js"
import DateTime from "https://deno.land/x/good@0.7.8/date.js"
import { generateKeys, encrypt, decrypt } from "https://deno.land/x/good@0.7.8/encryption.js"
import { Event, trigger, everyTime, once } from "https://deno.land/x/good@0.7.8/events.js"
import { recursivelyAllKeysOf, get, set, remove, merge, compareProperty } from "https://deno.land/x/good@0.7.8/object.js"
import { deepCopy, allKeyDescriptions, deepSortObject, shallowSortObject } from "https://deno.land/x/good@0.7.8/value.js"
import {makeIterable, map, filter, zip, count, enumerate, permute, combinations, slices, asyncIteratorToList, concurrentlyTransform} from "https://deno.land/x/good@0.7.8/iterable.js"
```