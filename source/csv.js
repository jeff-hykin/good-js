import { makeIterable, iter, next, Stop, asyncIteratorToList, forkAndFilter, enumerate, Iterable, } from "./iterable.js"
import { isAsyncIterable, AsyncFunction, } from "./value.js"
import { deferredPromise } from "./async.js"
import { NamedArray } from "./array.js"
import { levenshteinDistanceOrdering, utf8BytesToString } from "./string.js"

// this is mostly because I just can't remeber to spell seperator as separator
const argumentNames = [
    "input",
    "separator",
    "lineSeparator",
    "firstRowIsColumnNames",
    "columnNames",
    "skipEmptyLines",
    "commentSymbol",
]

/**
 * convert csv/tsv input to list-of-list/objects
 *
 * @example
 *     
 *     // tsv, first row is column names
 *     var { comments, columnNames, rows } = parseCsv({
 *         input: "col1\tcol2\n1\t1\n2\t2",
 *         separator: "\t",
 *         firstRowIsColumnNames: true,
 *     })
 * 
 *     // can also just get rows without other outputs
 *     var rows = parseCsv({
 *         input: "col1\tcol2\n1\t1\n2\t2",
 *         separator: ",",
 *     })
 * 
 *     // csv, no column names (list of list output)
 *     var { comments, columnNames, rows } = parseCsv({
 *         input: "col1,col2\n1,1\n2,2",
 *         separator: ",",
 *     })
 *     
 *     // async iterator example
 *     import { FileSystem } from "https://deno.land/x/quickr@0.6.28/main/file_system.js"
 *     var {comments, columnNames, rows} = await parseCsv({
 *         input: FileSystem.readLinesIteratively("../README.md"),
 *     })
 *
 *     var { comments, columnNames, rows } = parseCsv({
 *         input: [
 *             "col1,col2",
 *             "1,1",
 *             "2,2",
 *         ],
 *         separator: ",",
 *     })
 * @param {String|Iterator|AsyncIterator} arg1.input - can be a string, array of lines (strings), iterator of lines, 
 * @param {String} arg1.separator - usually "," or "\t", its the 'comma' of 'comma separated values'
 * @param {String} arg1.lineSeparator - usually is a newline, or \r\n
 * @param {Boolean} arg1.firstRowIsColumnNames - default=false
 * @param {Boolean} arg1.skipEmptyLines - default=true
 * @param {String|null} arg1.commentSymbol - default=null
 * @param {String|null} arg1.returnRowsAs - null, "array", "iterator", null means same as input
 * @returns {Object} output - 
 * @returns {[String]} output.comments - 
 * @returns {[String]} output.columnNames - 
 * @returns {Array(Array)} output.rows - 
 *
 */
export function parseCsv({
    input=null,
    separator=",",
    lineSeparator=/\r?\n/g,
    firstRowIsColumnNames=false,
    columnNames=null,
    skipEmptyLines=true,
    commentSymbol=null,
    returnRowsAs=null,
    ...other
}) {
    // arg checker
    if (Object.keys(other).length > 0) {
        const keys = Object.keys(other)
        const spellingHelp = keys.map(
            each=>`for ${JSON.stringify(each)} maybe you meant: ${levenshteinDistanceOrdering({word: each, otherWords: argumentNames})[0]}`
        ).join("\n        ")
        throw Error(`
            When calling parseCsv() some unrecognized arguments were given
            so I'm guessing you may have misspelled something:
                ${spellingHelp}
            
        `.replace(/\n            /g,"\n"))
    }
    
    let columnNamesForParsing = columnNames
    const isAComment = (line)=>commentSymbol&&line.startsWith(commentSymbol)
    const getCells = (eachLine,...args)=>{
        const cells = eachLine.split(separator)
        const cellsWithTypes = []
        let skipTo = 0
        let index = -1
        for (let eachCell of cells) {
            index += 1
            // apply any "skipTo" (which would be set by a previous loop)
            if (index < skipTo) {
                continue
            }
            
            const stripped = eachCell.trim()
            if (stripped.length == 0) {
                cellsWithTypes.push("")
            } else  {
                const firstChar = stripped[0]
                if (! (firstChar == '"' || firstChar == '[' || firstChar == '{')) {
                    // this converts scientific notation to floats, ints with whitespace to ints, null to null, etc
                    try {
                        cellsWithTypes.push(JSON.parse(stripped))
                    // if its not valid JSON, just treat it as a string
                    } catch (error) {
                        cellsWithTypes.push(stripped)
                    }
                } else {
                    // if firstChar == '"' or firstChar == '[' or firstChar == '{'
                    // this gets complicated because strings/objects/lists could contain an escaped separator
                    const remainingEndIndicies = []
                    let remainingIndex = index
                    while (remainingIndex <= cells.length) {
                        remainingEndIndicies.unshift(remainingIndex)
                        remainingIndex++
                    }
                    skipTo = 0
                    for (let eachRemainingEndIndex of remainingEndIndicies) {
                        try {
                            cellsWithTypes.push(
                                JSON.parse(
                                    cells.slice(index,eachRemainingEndIndex).join(separator)
                                )
                            )
                            skipTo = eachRemainingEndIndex
                            break
                        } catch (error) {
                            
                        }
                    }
                    // continue the outer loop
                    if (skipTo != 0) {
                        continue
                    } else {
                        // if all fail, go with the default of the shortest cell as a string
                        cellsWithTypes.push(eachCell)
                    }
                }
            }
        }

        if (columnNamesForParsing) {
            const namedArray = new NamedArray(cellsWithTypes.length)
            for (const [eachIndex, eachName, eachValue] of enumerate(columnNames, cellsWithTypes)) {
                namedArray[eachIndex] = eachValue
                namedArray[eachName] = eachValue
            }
            return namedArray
        }
        return cellsWithTypes
    }
    
    const isNonEmptyLine = skipEmptyLines ? ()=>true : (line)=>line.trim().length != 0
    var { comments, rows } = (
        Iterable(
            typeof input == "string" ? input.split(lineSeparator) : input
        ).map(
            eachLine=>{
                if (typeof eachLine != 'string') {
                    eachLine = utf8BytesToString(eachLine) // convert to string
                }
                return eachLine.replace(lineSeparator, "") // sanity (makes more sense if its an async iterable)
            }
        ).flat(
            1
        ).filter(
            isNonEmptyLine
        ).forkAndFilter({
            filters: {
                comments: isAComment,
                rows: (line)=>!isAComment(line),
            },
        })
    )
    
    // 
    // handle columnNames
    // 
    rows = rows.map(getCells)
    if (!firstRowIsColumnNames) {
        const shouldReturnArray = returnRowsAs=="array" || (returnRowsAs==null && input instanceof Array)
        if (shouldReturnArray) {
            if (!isAsyncIterable(input)) {
                rows = [...rows]
                rows.comments = [...comments]
                rows.columnNames = columnNames||[]
            } else {
                return new Promise(async (resolve, reject)=>{
                    try {
                        const outputValue = []
                        for await (const each of rows) {
                            outputValue.push(each)
                        }
                        const outputComments = []
                        for await (const each of comments) {
                            outputComments.push(each)
                        }
                        outputValue.rows = rows
                        outputValue.comments = outputComments
                        outputValue.columnNames = columnNames||[]
                    } catch (error) {
                        reject(error)
                    }
                })
            }
        } else {
            rows.rows = rows
            rows.comments = comments
            rows.columnNames = columnNames||[]
            return rows
        }
    // firstRowIsColumnNames
    } else {
        const shouldReturnArray = returnRowsAs=="array" || (returnRowsAs==null && input instanceof Array)
        if (isAsyncIterable(input)) {
            if (!shouldReturnArray) {
                var { iteratorForFirst, rows } = rows.forkAndFilter({
                    filters: {
                        firstElement: (line,index)=>index===0,
                        rows: (line,index)=>index!==0,
                    },
                })
                const promiseOutput = new Promise(async (resolve, reject)=>{
                    try {
                        const firstValue = await next(iteratorForFirst)
                        // no first value
                        if (firstValue == Stop) {
                            const output = []
                            output.rows = output
                            output.comments = comments
                            output.columnNames = columnNames||[]
                            return resolve(output)
                        }
                        const columnNamesFromInput = firstValue.map(each=>`${each}`)
                        const columnNamesForReturning = columnNamesFromInput || columnNames
                        columnNamesForParsing = columnNames || columnNamesFromInput
                        rows.rows = rows
                        rows.comments = comments
                        rows.columnNames = columnNamesForReturning
                        promiseOutput.columnNames.resolve(columnNamesForReturning)
                        resolve(rows)
                    } catch (error) {
                        promiseOutput.columnNames.reject(error)
                        reject(error)
                    }
                })
                promiseOutput.rows = rows
                promiseOutput.comments = comments
                promiseOutput.columnNames = deferredPromise()
                promiseOutput[Symbol.asyncIterator] = async function*(){
                    for await (const each of rows) {
                        yield each
                    }
                }
                return promiseOutput
            // should return array
            } else {
                return new Promise(async (resolve, reject)=>{
                    try {
                        const firstValue = await next(rows)
                        const output = []
                        // no first value
                        if (firstValue == Stop) {
                            output.rows = output
                            output.comments = comments
                            output.columnNames = columnNames||[]
                            return resolve(output)
                        }
                        const columnNamesFromInput = firstValue.map(each=>`${each}`)
                        const columnNamesForReturning = columnNamesFromInput || columnNames
                        columnNamesForParsing = columnNames || columnNamesFromInput
                        for await (const each of rows) {
                            output.push(each)
                        }
                        output.rows = output
                        output.comments = comments
                        output.columnNames = columnNamesForReturning
                        resolve(rows)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
        // input is not an async iterator
        } else {
            var { iteratorForFirst, rows } = rows.forkAndFilter({
                filters: {
                    firstElement: (line,index)=>index===0,
                    rows: (line,index)=>index!==0,
                },
            })
            const firstValue = next(rows)
            // no first value
            if (firstValue == Stop) {
                const output = []
                output.rows = output
                output.comments = comments
                output.columnNames = columnNames||[]
                return output
            }
            const columnNamesFromInput = firstValue.map(each=>`${each}`)
            const columnNamesForReturning = columnNamesFromInput || columnNames
            columnNamesForParsing = columnNames || columnNamesFromInput
            
            if (shouldReturnArray) {
                rows = [...rows]
            }
            rows.rows = rows
            rows.comments = comments
            rows.columnNames = columnNamesForReturning
            return rows
        }
    }
}

/**
 * array-of-arrays to CSV string
 *
 * @example
 *     var csvString = createCsv({
 *         columnNames: [ "column1", "column2", "column3", ],
 *         rows: [[1,2,3], [4,5,6]],
 *         separator: ",",
 *         alignColumns: false,
 *     })
 * 
 *     // columnNames not required
 *     var csvString = createCsv({
 *         rows: [[1,2,3], [4,5,6]],
 *     })
 *     
 *     // round-trip (almost) with createCsv(parseCsv())
 *     var { comments, columnNames, rows } = parseCsv({
 *         input: "col1\tcol2\n1\t1\n2\t2",
 *         separator: "\t",
 *         firstRowIsColumnNames: true,
 *         commentSymbol: "#",
 *     })
 *     const originalInput = createCsv({
 *         comments,
 *         rows: rows.concat([ 7,8,9 ]),
 *         columnNames,
 *         commentSymbol: "#",
 *     })
 *     
 * @returns {String} output - description
 *
 */
export function createCsv({ columnNames, rows, separator=",", eol="\n", commentSymbol=null, comments=[], alignColumns=true }) {
    if (comments.length && !commentSymbol) {
        throw Error(`\n\ncsv.write() was given comments, but was not given a commentSymbol. Please provide a commentSymbol argument\nex:\n    csv.write({ commentSymbol: "#", })\n`)
    }
    if (isAsyncIterable(comments) || comments instanceof Promise) {
        // recursive, but now the comments are a list, and the output is a promise
        return asyncIteratorToList(comments).then(
            (comments)=>createCsv({columnNames,rows,separator,eol,commentSymbol,comments,alignColumns})
        )
    }
    if (isAsyncIterable(rows) || rows instanceof Promise) {
        return asyncIteratorToList(rows).then(
            (rows)=>createCsv({columnNames,rows,separator,eol,commentSymbol,comments,alignColumns})
        )
    }

    const containsCommentSymbol = (string)=>{
        if (!commentSymbol) {
            return false 
        } else {
            return string.match(commentSymbol)
        }
    }
    const elementToString = (element) => {
        // strings are checked for separators, whitespace, etc
        if (typeof element == 'string') {
            // check for any reason that could mean the string needs to be quoted
            // if it passes all those checks, just use the unquoted string
            if (
                ! (
                    containsCommentSymbol(element) ||
                    element.trim().length != element.length ||
                    element.match(separator) ||
                    element.match(eol) ||
                    element.match('\n') ||
                    element.match('\r') ||
                    element.match(/^\{/) ||
                    element.match(/^\[/)
                )
            ) {
                return element
            }
        }
        // all other values are stored in json format
        try {
            return JSON.stringify(element)
        } catch (error) {
            return `${element}`
        }
    }
    const breakUpComments = function *(comments){
        for (let each of comments) {
            yield * `${each}`.replace(/\r/g, "").split("\n")
        }
    }

    let output = ""
    // 
    // all comments are at the top
    // 
    for (const eachCommentLine of breakUpComments(comments)) {
        output += `${commentSymbol}${eachCommentLine}${eol}`
    }

    let simplifiedRows = []
    
    // 
    // columnNames
    // 
    if (columnNames && columnNames.length > 0) {
        columnNames = columnNames.map(each=>elementToString(`${each}`))
        simplifiedRows.push(columnNames)
    }
    
    // 
    // convert to rows
    // 
    for (const eachRow of rows) {
        // normally would expect an array, but rows as strings can bypass escaping for custom element spacing/alignment etc
        if (typeof eachRow == 'string') {
            simplifiedRows.push(eachRow)
        } else if (eachRow instanceof Array) {
            simplifiedRows.push( eachRow.map(eachCell=>elementToString(eachCell)) )
        } else if (eachRow instanceof Object) {
            // cant convert object
            if (!columnNames) {
                let rowAsJson = ""
                try {
                    rowAsJson = JSON.stringify(eachRow)
                } catch (error) {}
                throw Error(`\n\nin csv.write() normally each row is an array of values (and a row can also be a string)\nA row can also be an object, but only if columnNames are given\nI got a row that is an object, but I don't have column names.\nThe row object was: ${eachRow}\nAs json that object looks like: ${rowAsJson}\n`, )
            }
            let asArray = []
            for (const eachName of columnNames) {
                const value = eachRow[eachName]
                if (value === undefined) {
                    eachRow[eachName] = ""
                }
                asArray.push(eachRow[eachName])
            }
            simplifiedRows.push( asArray.map(eachCell=>elementToString(eachCell)) )
        }
    }

    // 
    // alignment
    // 
    let columnSizes = []
    if (alignColumns) {
        let columnSizes = columnNames.map(each=>each.length)
        for (const eachRow of simplifiedRows) {
            if (eachRow instanceof Array) {
                let cellIndex = -1
                for (const eachCell of eachRow) {
                    cellIndex += 1
                    columnSizes[cellIndex] = Math.max(
                        (columnSizes[cellIndex] || 0),
                        eachCell.length,
                    )
                }
            }
        }
        
        let rowIndex = -1
        for (const eachRow of simplifiedRows) {
            rowIndex += 1
            if (eachRow instanceof Array) {
                // add padding to create alignment
                simplifiedRows[rowIndex] = eachRow.map((eachCell, cellIndex)=>eachCell.padEnd(columnSizes[cellIndex]))
            }
        }
    }

    // 
    // add rows to output
    // 
    for (const eachRow of simplifiedRows) {
        if (eachRow instanceof Array) {
            output += eachRow.join(separator) + eol
        } else {
            output += eachRow + eol
        }
    }
    
    return output
}