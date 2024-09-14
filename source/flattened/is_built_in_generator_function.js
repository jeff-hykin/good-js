import { AsyncGeneratorFunction } from "./async_generator_function__class.js"
import { SyncGeneratorFunction } from "./sync_generator_function__class.js"

export const isBuiltInGeneratorFunction = (value) => value instanceof SyncGeneratorFunction || value instanceof AsyncGeneratorFunction