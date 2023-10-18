#!/usr/bin/env -S deno run --allow-all
import { allKeys, get, set, remove, merge, hasKeyList, hasDirectKeyList, setIfMissingDirectKey, recursivelyOwnKeysOf, isEmpty, compareProperty } from "../source/object.js"

// 
// allKeys
// 
    console.log(`allKeys(null) is:`,allKeys(null))
    console.log(`allKeys(5) is:`,allKeys(5))
    console.log(`allKeys({a:10, b:99}) is:`,allKeys({a:10, b:99}))

// 
// allKeys
// 
    console.log(`recursivelyOwnKeysOf(null) is:`,recursivelyOwnKeysOf(null))
    console.log(`recursivelyOwnKeysOf(5) is:`,recursivelyOwnKeysOf(5))
    console.log(`recursivelyOwnKeysOf({a:10, b:99}) is:`,recursivelyOwnKeysOf({a:10, b:99}))

// 
// hasKeyList
// 
    console.group("hasKeyList")
    var obj = { key1: { key2: "inner"} }

    // true (constructor is a default key)
    console.log(`hasKeyList(obj, [ 'key1', 'constructor' ])`,hasKeyList(obj, [ 'key1', 'constructor' ]))
    // true
    console.log(`hasKeyList(obj, [ 'key1', 'key2' ])`,hasKeyList(obj, [ 'key1', 'key2' ]))
    // false
    console.log(`hasKeyList(obj, [ 'key1', 'blah' ])`,hasKeyList(obj, [ 'key1', 'blah' ]))

    // true for dynamic keys
    var proxyObject = new Proxy({}, {
        get(original, key, ...args) {
            if (key == "bob") {
                return "dynamically generated key"
            }
            return original[key]
        },
    })
    // true
    console.log(`hasKeyList(proxyObject, [ 'bob' ])`,hasKeyList(proxyObject, [ 'bob' ]))
    console.groupEnd()

// 
// hasDirectKeyList
// 
    console.group("hasDirectKeyList")
    var obj = { key1: { key2: "inner"} }
    
    // false
    console.log(`hasDirectKeyList(obj, [ 'key1', 'constructor' ]):`, hasDirectKeyList(obj, [ 'key1', 'constructor' ]))

    // true
    console.log(`hasDirectKeyList(obj, [ 'key1', 'key2' ]):`, hasDirectKeyList(obj, [ 'key1', 'key2' ]))

    // false
    console.log(`hasDirectKeyList(obj, [ 'key1', 'blah' ]):`, hasDirectKeyList(obj, [ 'key1', 'blah' ]))
    
    // true for dynamic keys
    var proxyObject = new Proxy({}, {
        get(original, key, ...args) {
            if (key == "bob") {
                return "dynamically generated key"
            }
            return original[key]
        },
    })
    // true
    console.log(`hasDirectKeyList(proxyObject, [ 'bob' ]):`, hasDirectKeyList(proxyObject, [ 'bob' ]))
    console.groupEnd()


// 
// get
// 
    console.group("get")
    var obj = { key1: { key2: 2 } }
    // equivlent to obj.key1.subKey.subSubKey
    console.log(get({
        keyList: [ 'key1', 'subKey', 'subSubKey' ],
        from: obj,
    }))
    console.log(get({
        keyList: [ 'key1', 'subKey', 'subSubKey' ],
        from: null,
    }))
    console.log(get({
        keyList: [ 'key1', 'subKey', 'subSubKey' ],
        from: null,
        failValue: 0
    }))
    console.log(get({
        keyList: [ 'key1', 'key2', ],
        from: obj,
        failValue: 0
    }))
    console.log(get({
        keyList: [ 'key1', ],
        from: obj,
        failValue: 0
    }))
    console.groupEnd()

// 
// set
// 
    console.group("set")
    var obj = { key1: {} }
    console.debug(`obj is:`,obj)
    // equivlent to obj.key1.subKey.subSubKey
    set({
        keyList: [ 'key1', 'subKey', 'subSubKey' ],
        to: 10,
        on: obj,
    })
    console.debug(`obj is:`,obj)
    console.groupEnd()


// 
// setIfMissingDirectKey
// 
    console.group("setIfMissingDirectKey")
    var obj = { key1: {} }
    
    console.debug(`obj is:`,obj)
    // equivlent to obj.key1.subKey.subSubKey
    setIfMissingDirectKey({
        keyList: [ 'key1', 'subKey', 'subSubKey' ],
        to: 10,
        on: obj,
    })
    console.debug(`obj.key1.subKey.subSubKey === 10 is:`,obj.key1.subKey.subSubKey === 10)
    console.debug(`obj is:`,obj)

    setIfMissingDirectKey({
        keyList: [ 'key1', 'subKey', 'subSubKey' ],
        to: 999,
        on: obj,
    })
    console.debug(`obj.key1.subKey.subSubKey === 999 is:`,obj.key1.subKey.subSubKey === 999)
    console.debug(`obj is:`,obj)

    console.debug(`obj.key1.subKey.subSubKey.toString is:`,obj.key1.subKey.subSubKey.toString)
    setIfMissingDirectKey({
        keyList: [ 'key1', 'subKey', 'subSubKey', 'toString' ],
        to: 999,
        on: obj,
    })
    console.debug(`obj.key1.subKey.subSubKey.toString is:`,obj.key1.subKey.subSubKey.toString)
    // toString wasnt a DIRECT key, so it was assigned
    // obj.key1.subKey.subSubKey.toString === 999
    console.groupEnd()
// 
// remove
// 
    console.group("remove")
    var obj = { key1: {} }
    // equivlent to obj.key1.subKey.subSubKey
    remove({
        keyList: [ 'key1', 'subKey', 'subSubKey' ],
        from: obj,
    })
    console.debug(`obj is:`,obj)
    remove({
        keyList: [ 'key1', ],
        from: obj,
    })
    console.debug(`obj is:`,obj)

    console.groupEnd()


// 
// merge
// 
    console.group("merge")
    var out = merge({ 
        oldData: {z:{a:1,b:1}     }, 
        newData: {z:{b:3,c:3}, f:1} 
    })
    console.debug(`out is:`,out)
    console.groupEnd()

// 
// isEmpty
// 
    console.group("isEmpty")
    console.debug(`isEmpty({}) is:`,isEmpty({}))
    console.debug(`isEmpty([]) is:`,isEmpty([]))
    console.debug(`isEmpty(null) is:`,isEmpty(null))
    console.debug(`isEmpty("") is:`,isEmpty(""))
    console.debug(`isEmpty("a") is:`,isEmpty("a"))
    console.debug(`isEmpty([1]) is:`,isEmpty([1]))
    console.debug(`isEmpty({a:1}) is:`,isEmpty({a:1}))
    console.groupEnd()

// 
// compareProperty
// 
    var things = [
        { basename: "gene_means",          },
        { basename: "igv",                 },
        { basename: "ttn_fitness",         },
        { basename: "gi",                  },
        { basename: "tpp",                 },
        { basename: "pathway_enrichment",  },
        { basename: "_version",            },
        { basename: "resampling",          },
        { basename: "normalize",           },
        { basename: "corrplot",            },
        { basename: "gumbel",              },
        { basename: "create_combined_wig", },
        { basename: "utest",               },
        { basename: "scatterplot",         },
        { basename: "tnseq_stats",         },
        { basename: "zinb",                },
        { basename: "|heatmap",            },
        { basename: "hmm",                 },
        { basename: "gff_to_prot_table",   },
        { basename: "_help",               },
        {                                  },
        { basename: "anova",               },
    ]
    things.sort(compareProperty({keyList: ["basename"]}))
    console.log(`Sorted things:`)
    console.debug(`JSON.stringify(things,0,4) is:`,JSON.stringify(things,0,4))