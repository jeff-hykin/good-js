import { iterZipLongSync } from "./iter_zip_long_sync.js"
export function zipLongList(...iterables) {
    return [...iterZipLongSync(...iterables)]
}