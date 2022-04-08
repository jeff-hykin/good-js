#!/usr/bin/env -S deno run --allow-all
import DateTime from "../source/date.js"

// a valid date with no time
var aDate = new DateTime('12/31/1999')
var aDate = new DateTime('1999-12-31')
var aDate = new DateTime('1999-12-31T00:00:00')
 
console.log(`aDate.day: ${aDate.day}`)       // 31
console.log(`aDate.month: ${aDate.month}`)     // 12
console.log(`aDate.year: ${aDate.year}`)      // 1999
console.log(`aDate.date: ${aDate.date}`)      // 12/31/1999
 
// easy time set/get
aDate.time = '1:30pm'
aDate.time = '1:30:20pm'
aDate.time = '1:30:20.5'
aDate.time = '1:30:20.5am'
console.log(`aDate.millisecond: ${aDate.millisecond}`) // 500
console.log(`aDate.second: ${aDate.second}`) // 20
console.log(`aDate.minute: ${aDate.minute}`)  // 30
console.log(`aDate.amPm: ${aDate.amPm}`)    // pm
console.log(`aDate.hour12: ${aDate.hour12}`)  // 1
console.log(`aDate.hour24: ${aDate.hour24}`)  // 13
console.log(`aDate.toArray(): ${aDate.toArray()}`)
 
// helpers
console.log(`aDate.monthName: ${aDate.monthName}`) // December
console.log(`aDate.dayName: ${aDate.dayName}`)   // Friday
console.log(`aDate.weekIndex: ${aDate.weekIndex}`) // 5
console.log(`aDate.unix: ${aDate.unix}`)      // milliseconds since the unix epoch
 
// an invalid date throw errors instead of failing silently
try {
    var aDate = new DateTime('Blah')
} catch (error) {
    console.log(`${error}`)
}