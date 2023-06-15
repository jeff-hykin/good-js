#!/usr/bin/env -S deno run --allow-all
import { parseCsv, createCsv } from "../source/csv.js"
import { asyncIteratorToList } from "../source/iterable.js"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.29/main/file_system.js"

var {comments, columnNames, rows} = await parseCsv({
    input: FileSystem.readLinesIteratively("../README.md"),
})
console.debug(`({comments, columnNames, rows}) is:`,({comments, columnNames, rows}))
var csvOutput = await createCsv({
    commentSymbol: "#",
    comments,
    columnNames,
    rows,
})

var rows = parseCsv({
    input: FileSystem.readLinesIteratively("../README.md"),
})
console.debug(`asyncIteratorToList(rows.map(each=>each.length)):`,await asyncIteratorToList(rows.map(each=>each.length)))

try {
    var {comments, columnNames, rows} = await parseCsv({
        input: FileSystem.readLinesIteratively("../README.md"),
        seperator: "\t",
    })
} catch (error) {
    console.log("THE ERROR BELOW IS INTENTIONAL")
    console.log(error)
}