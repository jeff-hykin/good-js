import { isIterator } from "./is_iterator.js"
import { isIterableTechnically } from "./is_iterable_technically.js"

export const isGeneratorObject = (value) => isIterator(value) && isIterableTechnically(value)