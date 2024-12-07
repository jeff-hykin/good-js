// 
// any code that NEEDS to run before other imports should go inside of patch()
// 
async function setup() {
        const $ = (await import("https://deno.land/x/dax@0.39.2/mod.ts")).default
        const { FileSystem } = (await import("https://deno.land/x/quickr@0.6.72/main/file_system.js"))
        const $$ = (...args)=>$(...args).noThrow()
        const reservedCharMap = {
            "&": "\\\\x26",
            "!": "\\\\x21",
            "#": "\\\\x23",
            "$": "\\\\$",
            "%": "\\\\x25",
            "*": "\\\\*",
            "+": "\\\\+",
            ",": "\\\\x2c",
            ".": "\\\\.",
            ":": "\\\\x3a",
            ";": "\\\\x3b",
            "<": "\\\\x3c",
            "=": "\\\\x3d",
            ">": "\\\\x3e",
            "?": "\\\\?",
            "@": "\\\\x40",
            "^": "\\\\^",
            "\`": "\\\\x60",
            "~": "\\\\x7e",
            "(": "\\\\(",
            ")": "\\\\)",
            "[": "\\\\[",
            "]": "\\\\]",
            "{": "\\\\{",
            "}": "\\\\}",
            "/": "\\\\/",
            "-": "\\\\x2d",
            "\\\\": "\\\\\\\\",
            "|": "\\\\|",
        }

        const RX_REGEXP_ESCAPE = new RegExp(
            `[${Object.values(reservedCharMap).join("")}]`,
            "g",
        )

        

        function escapeRegexMatch(str) {
            return str.replaceAll(
                RX_REGEXP_ESCAPE,
                (m) => reservedCharMap[m],
            )
        }
        
        var _envShim = {}
        var Deno = globalThis.Deno||{
            pid:1,
            env: {
                toObject() {
                    return _envShim
                },
                get(key) {
                    return _envShim[key]
                },
                set(key, value) {
                    _envShim[key] = value
                },
                delete(key) {
                    delete _envShim[key]
                },
            }
        }
        
        function makeShell({
            args=[],
            stdin=Deno.stdin,
            stdout=Deno.stdout,
            stderr=Deno.stderr,
            env={...Deno.env.toObject()},
            exportedEnvNames=null,
            pid=Deno.pid,
            pidOfLastProcess=Deno.pid-1,
            lastStatus={
                code: 0,
                signal: 0,
            },
            source,
        }={}) {
            const initial = {
                stdin,
                stdout,
                stderr,
                pid,
                pidOfLastProcess,
                lastStatus, // FIXME: as of writing, this var never gets updated
                jobs: [],
                aliases: {},
                functions: {},
                shellOpts: "himBH",
                shoptOpts: {
                    "cdable_vars":             false,
                    "cdspell":                 false,
                    "checkhash":               false,
                    "checkwinsize":            false,
                    "cmdhist":                 true,
                    "compat31":                false,
                    "dotglob":                 false,
                    "execfail":                false,
                    "expand_aliases":          true,
                    "extdebug":                false,
                    "extglob":                 false,
                    "extquote":                true,
                    "failglob":                false,
                    "force_fignore":           true,
                    "gnu_errfmt":              false,
                    "histappend":              false,
                    "histreedit":              false,
                    "histverify":              false,
                    "hostcomplete":            true,
                    "huponexit":               false,
                    "interactive_comments":    true,
                    "lithist":                 false,
                    "login_shell":             false,
                    "mailwarn":                false,
                    "no_empty_cmd_completion": false,
                    "nocaseglob":              false,
                    "nocasematch":             false,
                    "nullglob":                false,
                    "progcomp":                true,
                    "promptvars":              true,
                    "restricted_shell":        false,
                    "shift_verbose":           false,
                    "sourcepath":              true,
                    "xpg_echo":                false,
                },
                exportedEnvNames: new Set([...exportedEnvNames||[]]),
                env: {
                    "$": pid,
                    // possible TODO: change this path to be the path of the caller, not the path to where this code is
                    "0": source||FileSystem.thisFile, // decodeURIComponent(new URL(import.meta.url).pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")), //TODO: check that this replace is still needed
                    "SHLVL": env["SHLVL"] || "0",
                    ...env,
                },
            }
            const createScope = (prevScope, newArgs)=>{
                const scope = {
                    args: newArgs,
                    env: {},
                    _localEnvObj: {},
                }
                if (newArgs == null) {
                    // no copy because shift would affect both
                    // TODO: check if this^ is always right
                    scope.args = prevScope?.args
                }
                scope.env = new Proxy(scope._localEnvObj, {
                    // ownKeys(target, ...args) {
                    //     return Reflect.ownKeys(target, ...args) 
                    // },
                    get(original, key, ...args) {
                        // Numbered args
                        if (key-0>0) {
                            return scope.args[key]||""
                        }
                        // specials
                        switch (key) {
                            case "@":
                                return scope.args
                            case "&":
                                return `${shell.pidOfLastProcess}`
                            case "-":
                                return shell.shellOpts
                            case "?":
                                return `${shell.lastStatus?.code||0}`
                            case "!":
                                return `${shell.lastStatus?.signal||0}`
                            case "#":
                                return `${scope.args.length}`
                            case "*":
                                return scope.args.join(" ")
                        }
                        // grab local one first
                        if (Reflect.has(original, key)) {
                            return Reflect.get(original, key, ...args)
                        } else {
                            return Reflect.get(prevScope?.env||{}, key, ...args)
                        }
                    },
                    set(original, key, ...args) {
                        // if local exists, or external one doesnt, then set local
                        if (Reflect.has(original, key) || !Reflect.has(prevScope?.env||{}, key)) {
                            return Reflect.set(original, key, ...args)
                        }
                        // otherwise, set external
                        return Reflect.set(prevScope?.env||{}, key, ...args)
                    },
                    // has: Reflect.has,
                    // deleteProperty: Reflect.deleteProperty,
                    // isExtensible: Reflect.isExtensible,
                    // preventExtensions: Reflect.preventExtensions,
                    // setPrototypeOf: Reflect.setPrototypeOf,
                    // defineProperty: Reflect.defineProperty,
                    // getPrototypeOf: Reflect.getPrototypeOf,
                    // getOwnPropertyDescriptor: Reflect.getOwnPropertyDescriptor,
                })

                return scope
            }
            
            const shell = {
                ...initial,
                _scopeStack: [
                    createScope(null, args),
                ],
                get exportedEnv() {
                    const vars = {}
                    for (const each of shell.exportedEnvNames) {
                        vars[each] = shell.env[each]
                    }
                    return vars
                },
                // env
                get env() {
                    return shell._scopeStack.slice(-1)[0].env
                },
                // FIXME: rework everything with consideration for arrays
                getVar(name) {
                    return this.asString(this.env[name])
                },
                split(value) {
                    // FIXME: the split might need to have a dynamic split character
                    return this.asString(value).split(/\s+/g).filter(each=>each!="")
                    // NOTE: the filtering of empty strings seems to match bash behavior
                    //       but I'm not sure about the spec
                    // it IS a notable edgecase, since it makes empty args impossible sometimes
                },
                asString(value) {
                    if (value instanceof Array) {
                        return value.join(" ")
                    } else if (value == null) {
                        return ""
                    } else if (typeof value == "string") {
                        return value
                    } else {
                        console.debug(`value:`, value)
                        throw Error(`shell.asString() got a weird value: ${typeof value}, ${value}`, value)
                    }
                },
                async argExpansionPass(arg) {
                    // NOTE: this sometimes returns an array, and sometimes a string
                    // this needs to handle ${varName#a} and **/*, ~, etc based on shell.shellOpts
                    // NOTE: ${@:1} and ${*:1} are both treated like arrays, not strings
                    return arg
                },
            }
            
            const overridableBuiltins = {
                "help": ()=>{/*FIXME*/},
                "builtin": ()=>{/*FIXME*/},
                "alias": ()=>{/*FIXME*/},
                ".": ()=>{/*FIXME*/},
                "bind": ()=>{/*FIXME*/},
                "command": ()=>{/*FIXME*/},
                "complete": ()=>{/*FIXME*/},
                "declare": ()=>{/*FIXME*/},
                "disown": ()=>{/*FIXME*/},
                "enable": ()=>{/*FIXME*/},
                "exec": ()=>{/*FIXME*/},
                "export": ()=>{/*FIXME*/},
                "fc": ()=>{/*FIXME*/},
                "hash": ()=>{/*FIXME*/},
                "history": ()=>{/*FIXME*/},
                "jobs": ()=>{/*FIXME*/},
                "let": ()=>{/*FIXME*/},
                "logout": ()=>{/*FIXME*/},
                "printf": ()=>{/*FIXME*/},
                "pwd": ()=>{/*FIXME*/},
                "readonly": ()=>{/*FIXME*/},
                "shift": ()=>{/*FIXME*/},
                "source": ()=>{/*FIXME*/},
                "test": ()=>{/*FIXME*/},
                "times": ()=>{/*FIXME*/},
                "true": ()=>{/*FIXME*/},
                "typeset": ()=>{/*FIXME*/},
                "umask": ()=>{/*FIXME*/},
                "unset": ()=>{/*FIXME*/},
                ":": ()=>{/*FIXME*/},
                "bg": ()=>{/*FIXME*/},
                "break": ()=>{/*FIXME*/},
                "caller": ()=>{/*FIXME*/},
                "cd": ()=>{/*FIXME*/},
                "compgen": ()=>{/*FIXME*/},
                "continue": ()=>{/*FIXME*/},
                "dirs": ()=>{/*FIXME*/},
                "echo": ()=>{/*FIXME*/},
                "eval": ()=>{/*FIXME*/},
                "exit": ()=>{/*FIXME*/},
                "false": ()=>{/*FIXME*/},
                "fg": ()=>{/*FIXME*/},
                "getopts": ()=>{/*FIXME*/},
                "kill": ()=>{/*FIXME*/},
                "local": ()=>{/*FIXME*/},
                "popd": ()=>{/*FIXME*/},
                "pushd": ()=>{/*FIXME*/},
                "read": ()=>{/*FIXME*/},
                "return": ()=>{/*FIXME*/},
                "set": ()=>{
                    /*FIXME*/
                    // this can change all the arguments for $@
                },
                "shopt": ()=>{/*FIXME*/},
                "suspend": ()=>{/*FIXME*/},
                "trap": ()=>{/*FIXME*/},
                "type": ()=>{/*FIXME*/},
                "ulimit": ()=>{/*FIXME*/},
                "unalias": ()=>{/*FIXME*/},
                "wait": ()=>{/*FIXME*/},
            }
            const cannotBeFunctionNames = {
                "if": ()=>{ /*FIXME*/ },
                "for": ()=>{ /*FIXME*/ },
                "case": ()=>{ /*FIXME*/ },
                "function": ()=>{ /*FIXME*/ },
                "select": ()=>{ /*FIXME*/ },
                "while": ()=>{ /*FIXME*/ },
                "[[": ()=>{ /*FIXME*/ },
                "time": ()=>{ /*FIXME*/ },
                "until": ()=>{ /*FIXME*/ },
            }
            const cannotBeAliasOrFunctionName = {
                "((": ()=>{ /*FIXME*/ },
            }
            
            return shell
        }

        return {
            makeShell,
            $,
            $$,
        }
}

// this is the generic code
function makeImport(codeString) {
    function replaceNonAsciiWithUnicode(str) {
        return str.replace(/[^\0-~](?<!\n|\r|\t|\0)/g, (char) => {
            return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
        })
    }

    return `import { makeShell, $, $$ } from "data:text/javascript;base64,${btoa(replaceNonAsciiWithUnicode(codeString))}"`
}

var codeString = setup.toString() + "\nexport const {makeShell, $, $$} = await setup()"
console.log(makeImport(codeString))