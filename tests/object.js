#!/usr/bin/env -S deno run --allow-all
import { allKeys, get, set, remove, merge } from "../source/object.js"

console.log(`allKeys(5) is:`,allKeys(5))