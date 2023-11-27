import { parseArgs, flag, required } from "../flattened/parse_args.js"

const output = parseArgs({
    rawArgs: [ "1", "2", "--option", "3", ],
    fields: [
        [["-o", "--option"], flag, required ],
        [["--version"], flag ],
        [["--number"], (value)=>parseInt(value)],
    ],
})
console.debug(`output is:`,output)
console.debug(`output.numberedArgs.length is:`,output.numberedArgs.length)
console.debug(`output.numberedArgs is:`,output.numberedArgs)

{
    try {
        const output = parseArgs({
            rawArgs: [ "1", "2", "3", ],
            fields: [
                [["-o", "--option"], flag, required ],
                [["--version"], flag ],
                [["--number"], (value)=>parseInt(value)],
            ],
        })
        console.debug(`output is:`,output)
        console.debug(`output.numberedArgs.length is:`,output.numberedArgs.length)
        console.debug(`output.numberedArgs is:`,output.numberedArgs)
    } catch (error) {
        console.debug(`THERE SHOULD BE AN ERROR:`,error)
    }
    
}