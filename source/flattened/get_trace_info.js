// modified version of https://github.com/errwischt/stacktrace-parser/blob/master/src/stack-trace-parser.js
// this one supports deno, including paths with newlines
// NOTE:
//  1. There is no perfect parsing of stack traces on Node or Deno (there can be on the web)
//  2. For Node, any path with a newline will cause a problem
//  3. For Deno however, it is absurdly hard to defeat the parsing. Basically only a malicous attack can
//     defeat the parsing. There would need to be a path that contained colons, numbers,
//     followed by a newline, a closing parenthese, and then have "    at " after the newline.


// node.js style:
// Error: 
//     at /Users/cfisher/Git/squashed/execProcess.js:6:17
//     at ChildProcess.exithandler (child_process.js:213:5)
//     at emitTwo (events.js:106:13)
//     at ChildProcess.emit (events.js:191:7)
//     at maybeClose (internal/child_process.js:877:16)
//     at Socket.<anonymous> (internal/child_process.js:334:11)
//     at emitOne (events.js:96:13)
//     at Socket.emit (events.js:188:7)
//     at Pipe._handle.close [as _onclose] (net.js:498:12)
// firefox style:
//i/s<@https://esm.sh/gh/jeff-hykin/good-js@7e68666/es2022/source/flattened/intersection.mjs:2:39
//i@https://esm.sh/gh/jeff-hykin/good-js@7e68666/es2022/source/flattened/intersection.mjs:2:26
//A@debugger eval code:1:23
//@debugger eval code:1:8
// deno style:
// Error
//     at https://esm.sh/gh/jeff-hykin/good-js@7e68666/es2022/source/flattened/intersection.mjs:2:41
// Error
//     at A.
// hi::
//  (file:///Users/jeffhykin/repos/good-js/weird:\ .ignore\ a.js:10:38)
// #@/test_file.js#a:5:16)
//     at <anonymous>:1:47
//     at test (file:///Users/jeffhykin/repos/good-js/weird:\ .ignore\ a.js:10:38)
// #@/test_file.js:2:12)
//     at <anonymous>:1:34
//     at Array.sort (<anonymous>)
//     at Module.i (https://esm.sh/gh/jeff-hykin/good-js@7e68666/es2022/source/flattened/intersection.mjs:2:26)
//     at A (<anonymous>:3:7)
//     at <anonymous>:1:30
    // /^    at ([\w$]+)/

const UNKNOWN_FUNCTION = "<unknown>"

/**
 * Extracts and parses the current JavaScript stack trace into a structured format.
 * Supports multiple environments including Chrome, Node.js, Gecko, WinJS, and Deno.
 * 
 * @returns {Array<Object>} An array of parsed stack frame objects, each representing a call site.
 * Each object may contain:
 * - `path`: {string|null} The file name or URL where the function is defined.
 * - `methodName`: {string} The name of the function/method at the call site.
 * - `lineNumber`: {number|null} The line number in the source file.
 * - `column`: {number|null} The column number in the source file.
 */
export function getTraceInfo() {
    const stackString = new Error().stack
    if (typeof Deno !== "undefined") {
        return parseDeno(stackString).slice(1)
    }
    const lines = stackString.split("\n")
    return lines.reduce((stack, line) => {
        const parseResult = parseChrome(line) || parseWinjs(line) || parseGecko(line) || parseNode(line) || parseJSC(line)

        if (parseResult) {
            stack.push(parseResult)
        }

        return stack
    }, []).slice(1)
}

const chromeRe = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|rsc|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i
const chromeEvalRe = /\((\S*)(?::(\d+))(?::(\d+))\)/

/**
 * Parses a single line of a Chrome-like stack trace.
 * Handles native and eval frames specifically.
 * 
 * @param {string} line - A single line from a stack trace.
 * @returns {Object|null} A parsed stack frame object or `null` if the line doesn't match.
 * The object contains:
 * - `path`: {string|null} Source file URL or null if native.
 * - `methodName`: {string} Name of the method/function (defaults to UNKNOWN_FUNCTION if missing).
 * - `lineNumber`: {number|null} Line number in the source file.
 * - `column`: {number|null} Column number in the source file.
 */
function parseChrome(line) {
    const parts = chromeRe.exec(line)

    if (!parts) {
        return null
    }

    const isNative = parts[2] && parts[2].indexOf("native") === 0 // start of line
    const isEval = parts[2] && parts[2].indexOf("eval") === 0 // start of line

    const submatch = chromeEvalRe.exec(parts[2])
    if (isEval && submatch != null) {
        // throw out eval line/column and use top-most line/column number
        parts[2] = submatch[1] // url
        parts[3] = submatch[2] // line
        parts[4] = submatch[3] // column
    }

    return {
        path: !isNative ? parts[2] : null,
        methodName: parts[1] || UNKNOWN_FUNCTION,
        lineNumber: parts[3] ? +parts[3] : null,
        column: parts[4] ? +parts[4] : null,
    }
}

const winjsRe = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|rsc|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i

function parseWinjs(line) {
    const parts = winjsRe.exec(line)

    if (!parts) {
        return null
    }

    return {
        path: parts[2],
        methodName: parts[1] || UNKNOWN_FUNCTION,
        lineNumber: +parts[3],
        column: parts[4] ? +parts[4] : null,
    }
}

const geckoRe = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|rsc|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i
const geckoEvalRe = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i

function parseGecko(line) {
    const parts = geckoRe.exec(line)

    if (!parts) {
        return null
    }

    const isEval = parts[3] && parts[3].indexOf(" > eval") > -1

    const submatch = geckoEvalRe.exec(parts[3])
    if (isEval && submatch != null) {
        // throw out eval line/column and use top-most line number
        parts[3] = submatch[1]
        parts[4] = submatch[2]
        parts[5] = null // no column when eval
    }

    return {
        path: parts[3],
        methodName: parts[1] || UNKNOWN_FUNCTION,
        lineNumber: parts[4] ? +parts[4] : null,
        column: parts[5] ? +parts[5] : null,
    }
}

const javaScriptCoreRe = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i

function parseJSC(line) {
    const parts = javaScriptCoreRe.exec(line)

    if (!parts) {
        return null
    }

    return {
        path: parts[3],
        methodName: parts[1] || UNKNOWN_FUNCTION,
        lineNumber: +parts[4],
        column: parts[5] ? +parts[5] : null,
    }
}

const nodeRe = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i

function parseNode(line) {
    const parts = nodeRe.exec(line)

    if (!parts) {
        return null
    }

    return {
        path: parts[2],
        methodName: parts[1] || UNKNOWN_FUNCTION,
        lineNumber: +parts[3],
        column: parts[4] ? +parts[4] : null,
    }
}

function parseDeno(string) {
    let values = []
    // roughly: "    at " [optional method name] <anonymous>|file:///|https://|ftp://    :[line number]:[column number]
    for (const each of string.matchAll(/\n    at (?:([\w\W]+?)\s)??(\(<anonymous>:\d+:\d+\)|\(<anonymous>\)|<anonymous>:\d+:\d+|<anonymous>|(?:(file:\/|https?:|ftp:|blob:)\/\/([\w\W]+?):(\d+):(\d+)|\((file:\/|https?:|ftp:|blob:)\/\/([\w\W]+?):(\d+):(\d+)\)))(?=\n    at |$)/g)) {
        let path = each[2]
        if (path[0] === "(" && path[path.length - 1] === ")") {
            path = path.slice(1, -1)
        }
        const output = {
            path: path,
            methodName: each[1] || UNKNOWN_FUNCTION,
            lineNumber: null,
            column: null,
        }
        let match
        if ((match = path.match(/:(\d+):(\d+)$/))) {
            output.path = path.slice(0, -match[0].length)
            output.lineNumber = match[1] - 0
            output.column = match[2] - 0
        }
        values.push(output)
    }
    return values
}