- `makeIterable` now works for generator functions and iterables
- `isIterableTechnically` now is correct, returns false for plain objects
- `isEmptyObject` returns false when given non-objects
- `toRepresentation` fixed for Sets and Error objects

todo:
- fix zip for async iterators
- zipShort
- rename built_in to builtin
- redo camel to snake
- fix double-filter crash `Iterable().filter().filter()`