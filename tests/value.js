#!/usr/bin/env -S deno run --allow-all
import { deepCopy } from "../source/value.js"

console.log(deepCopy(10))
