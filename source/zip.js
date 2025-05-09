import { BlobReader, BlobWriter, TextReader, TextWriter, ZipReader, ZipWriter } from "https://esm.sh/jsr/@zip-js/zip-js@2.7.57"
import { setSubtract } from './flattened/set_subtract.js'

function isValidDataType(data) {
    if (typeof data === "string") {
        return true
    } else if (data instanceof Uint8Array) {
        return true
    } else if (data instanceof ArrayBuffer) {
        return true
    } else if (data instanceof Blob) {
        return true
    }
    return false
}

function toReader(data) {
    if (typeof data === "string") {
        return new TextReader(data)
    } else if (data instanceof Uint8Array) {
        return new BlobReader(new Blob([data]))
    } else if (data instanceof ArrayBuffer) {
        return new BlobReader(new Blob([data]))
    } else if (data instanceof Blob) {
        return new BlobReader(data)
    } else {
        throw Error(`Unsupported data type (expected string, Uint8Array, ArrayBuffer, or Blob): ${typeof data}`)
    }
}

/**
 * Creates a zip blob from an object containing file paths and their content.
 * @example
 * ```js
 * const zipArrayBuffer = await createZipBlob({
 *     'folder1/hello.txt': 'Hello world!',
 *     'folder1/hello': { content: '#!/usr/bin/env sh\necho hi', executable: true },
 *     'folder2/data.bin': new Uint8Array([1, 2, 3, 4, 5]),
 *     'folder3/': [] // Represents a directory (must be empty)
 *     'folder3/thing.txt': {
 *           content: 'something',
 *           // all fields are based on https://jsr.io/@zip-js/zip-js/doc/~/EntryMetaData
 *           // executable, // boolean
 *           // lastModDate, // Date object
 *           // rawLastModDate, // Date object
 *           // lastAccessDate, // Date object
 *           // creationDate, // Date object
 *           // directory, // boolean
 *           // comment, // string
 *           // rawComment, // bytes (Uint8Array)
 *           // msDosCompatible, // boolean
 *           // zip64, // boolean
 *           // encrypted, // boolean
 *           // zipCrypto, // boolean
 *           // rawLastAccessDate, // number or bigint (presumably unix epoch in milliseconds)
 *           // rawCreationDate, // number or bigint (presumably unix epoch in milliseconds)
 *           // internalFileAttributes, // number
 *           // externalFileAttributes, // number
 *           // diskNumberStart, // number
 *           // version, // number
 *           // versionMadeBy, // number
 *           // filename, // string
 *           // rawFilename, // bytes (Uint8Array)
 *     },
 * })
 * ```
 * @param {Object} files - An object where keys are file paths and values are either strings, Uint8Arrays, or empty arrays for directories.
 * @returns {Promise<Uint8Array>} A promise that resolves to the zip blob as an ArrayBuffer.
 */
export async function zipCreate(files) {
    const zipFileWriter = new BlobWriter()
    const zipWriter = new ZipWriter(zipFileWriter)
    
    
    // directories are a problem if they're listed but not empty
    const wasDir = {}
    for (const [path, content] of Object.entries(files)) {
        if (Array.isArray(content) && content.length === 0) {
            wasDir[path] = true
        } else if (content instanceof Object && content.directory) {
            wasDir[path] = true
        }
    }
    const dirPaths = new Set(Object.keys(wasDir))
    const allPaths = new Set(Object.keys(files))
    const nonDirPaths =  setSubtract({value: dirPaths, from: allPaths})
    const skip = new Set([])
    if (dirPaths.size > 0) {
        for (const eachNonDirPath of nonDirPaths) {
            for (const eachDirPath of dirPaths) {
                if (eachNonDirPath.startsWith(eachDirPath)) {
                    skip.add(eachDirPath)
                    dirPaths.delete(eachDirPath)
                }
            }
        }
    }
    
    for (const [path, content] of Object.entries(files)) {
        if (skip.has(path)) {
            continue
        }
        
        if (Array.isArray(content) && content.length === 0) {
            // Handle directory
            await zipWriter.add(path, null, { directory: true })
        } else if (isValidDataType(content)) {
            await zipWriter.add(path, toReader(content))
        } else if (content instanceof Object) {
            const {
                content: contentObj,
                directory,
                executable,
                filename,
                rawFilename,
                comment,
                rawComment,
                uncompressedSize,
                compressedSize,
                offset,
                diskNumberStart,
                lastModDate,
                rawLastModDate,
                lastAccessDate,
                rawLastAccessDate,
                creationDate,
                rawCreationDate,
                internalFileAttribute,
                internalFileAttributes,
                externalFileAttribute,
                externalFileAttributes,
                msDosCompatible,
                zip64,
                encrypted,
                version,
                versionMadeBy,
                zipCrypto,
            } = content
            await zipWriter.add(path, directory? null : toReader(contentObj), {
                directory,
                executable, 
                filename,
                rawFilename,
                comment,
                rawComment,
                uncompressedSize,
                compressedSize,
                offset,
                diskNumberStart,
                lastModDate,
                rawLastModDate,
                lastAccessDate,
                rawLastAccessDate,
                creationDate,
                rawCreationDate,
                internalFileAttributes,
                externalFileAttributes,
                msDosCompatible,
                zip64,
                encrypted,
                version,
                versionMadeBy,
                zipCrypto,
            })
        }
    }

    await zipWriter.close()
    return zipFileWriter.getData().then((data) => data.arrayBuffer()).then(array=>new Uint8Array(array))
}

/**
 * Extracts content from a zip file and returns an object with file paths as keys and their content as values.
 * @example
 * ```js
 * const zipData = new Uint8Array([1, 2, 3, 4, 5])
 * const content = await extractZipContent(zipData)
 * console.log(content)
 * ```
 * @param {Uint8Array} zipData - The zip file data as a Uint8Array.
 * @returns {Promise<Object>} A promise that resolves to an object where keys are file paths and values are either Uint8Arrays for files or empty arrays for directories.
 */
export async function zipParse(zipData) {
    const zipFileReader = new BlobReader(new Blob([zipData]))
    const zipReader = new ZipReader(zipFileReader)
    const entries = await zipReader.getEntries()
    const result = {}

    for (const entry of entries) {
        if (entry.directory) {
            result[entry.filename] = []
        } else {
            const blobWriter = new BlobWriter()
            const content = await entry.getData(blobWriter)
            const arrayBuffer = await content.arrayBuffer()
            const obj = {
                content: new Uint8Array(arrayBuffer),
                directory: entry.directory,
                executable: entry.executable,
                filename: entry.filename,
                rawFilename: entry.rawFilename,
                comment: entry.comment,
                rawComment: entry.rawComment,
                uncompressedSize: entry.uncompressedSize,
                compressedSize: entry.compressedSize,
                offset: entry.offset,
                diskNumberStart: entry.diskNumberStart,
                lastModDate: entry.lastModDate,
                rawLastModDate: entry.rawLastModDate,
                lastAccessDate: entry.lastAccessDate,
                rawLastAccessDate: entry.rawLastAccessDate,
                creationDate: entry.creationDate,
                rawCreationDate: entry.rawCreationDate,
                internalFileAttributes: entry.internalFileAttributes,
                externalFileAttributes: entry.externalFileAttributes,
                msDosCompatible: entry.msDosCompatible,
                zip64: entry.zip64,
                encrypted: entry.encrypted,
                version: entry.version,
                versionMadeBy: entry.versionMadeBy,
                zipCrypto: entry.zipCrypto,
                filenameUTF8: entry.filenameUTF8,
                commentUTF8: entry.commentUTF8,
                signature: entry.signature,
                extraField: entry.extraField,
                rawExtraField: entry.rawExtraField,
                compressionMethod: entry.compressionMethod,
            }
            for (const [key, value] of Object.entries(obj)) {
                if (value === undefined) {
                    delete obj[key]
                }
            }
            result[entry.filename] = obj
        }
    }

    await zipReader.close()
    return result
}