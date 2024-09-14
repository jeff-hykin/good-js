throw Error(`
    It looks like you imported isGeneratorFunction

    Well I'm sorry to tell you there is (and will never be) a prefect way to detect if a function is a generator function.
    However, there is a way to detect if a function is a built-in generator function.

    To to that instead:
        import { isBuiltInGeneratorFunction } from "https://deno.land/x/good/flattened/is_built_in_generator_function.js"
`)

export const isGeneratorFunction = (value) => {}