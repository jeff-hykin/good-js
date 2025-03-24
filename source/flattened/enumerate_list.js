import { enumerate } from "./enumerate.js"
export function enumerateList(...iterables) {
    return [...enumerate(...iterables)]
}