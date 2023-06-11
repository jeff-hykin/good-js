#!/usr/bin/env -S deno run --allow-all
import { parseCsv, createCsv } from "../source/csv.js"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.28/main/file_system.js"

var {comments, columnNames, rows} = await parseCsv({
    input: FileSystem.readLinesIteratively("../README.md"),
})
console.debug(`({comments, columnNames, rows}) is:`,({comments, columnNames, rows}))
var csvOutput = createCsv({
    commentSymbol: "#",
    comments,
    columnNames,
    rows,
})
console.debug(`csvOutput is:`,csvOutput)