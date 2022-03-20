import { capitalize, indent, toCamelCase, toPascalCase, toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase } from "../source/string.js"

console.log(`${capitalize("howdy_howdy_howdy")}`)
console.log(`${toCamelCase("howdy_howdy_howdy")}`)
console.log(`${toPascalCase("howdy_howdy_howdy")}`)
console.log(`${indent({string:"howdy_howdy_howdy"})}`)