import { makeIterable } from "./iterable.js"
import { isAsyncIterable } from "./value.js"
import { levenshteinDistanceOrdering } from "./string.js"

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
    let comments     = []
    let rows         = []
    let fileColumnNames = []
    let isFirstDataRow = true
    
    function handleLine(eachLine) {
        // remove all weird whitespace as a precaution
        eachLine = eachLine.replace(lineSeparator, "")
        
        // 
        // comments
        // 
        if (commentSymbol) {
            if (eachLine.startsWith(commentSymbol)) {
                comments.push(
                    eachLine.slice(commentSymbol.length)
                )
                return
            }
        }
        
        // 
        // empty lines
        // 
        if (skipEmptyLines && eachLine.trim().length == 0) {
            return
        }
        
        // 
        // cell data
        //
        let cells = eachLine.split(separator)
        let cellsWithTypes = []
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
        
        // 
        // fileColumnNames
        // 
        if (isFirstDataRow) {
            isFirstDataRow = false
            if (firstRowIsColumnNames) {
                fileColumnNames = cellsWithTypes.map(each=>`${each}`.trim())
                return
            }
        }
        
        rows.push(cellsWithTypes)
    }
    
    function afterLinesAreHandled() {
        // if fileColumnNames
        columnNames = columnNames || fileColumnNames
        if (columnNames) {
            for (const eachRow of rows) {
                let columnIndex = -1
                for (const eachColumnName of columnNames) {
                    columnIndex+=1
                    row[eachColumnName] = eachRow[columnIndex]
                }
            }
        }
        rows.columnNames = columnNames
        rows.comments = comments
        rows.rows = rows
        return rows
    }
    
    const iterable = makeIterable(typeof input == "string" ? input.split(lineSeparator) : input)
    if (!isAsyncIterable(iterable)) {
        return afterLinesAreHandled()
    } else {
        // return a promise because we have to in order to process the iterator
        return ((async ()=>{
            for await (const eachLine of iterable) {
                handleLine(eachLine)
            }
            return afterLinesAreHandled()
        })())
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