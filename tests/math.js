#!/usr/bin/env -S deno run --allow-all
import { stats, sum, spread } from "../source/math.js"
import { toRepresentation } from "../source/string.js"

console.log(toRepresentation(stats([1,2342,24,4])))