import { Map } from "../source/map.js"

var a,b,c,d

a = new Map([[1,2]])
b = new Map([[1,2], [a, 99], [[1,2,3],[99]]])
console.log(b.toString())

console.debug(`b.get([1,2,3]) is:`,b.get([1,2,3]))