import { iterZipShortSync } from "./iter_zip_short_sync.js"
export function zipShortList(...iterables) {
    return [...iterZipShortSync(...iterables)]
}