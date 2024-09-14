import { typedArrayClasses } from "./typed_array_classes.js"

export const builtInCopyablePrimitiveClasses = new Set([ RegExp, Date, URL, ...typedArrayClasses, globalThis.ArrayBuffer, globalThis.DataView, ])