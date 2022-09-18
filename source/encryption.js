import { encode as encodeBase64, decode as decodeBase64 } from "https://deno.land/std@0.156.0/encoding/base64.ts"

// From MDN (and similar one on discord)
function extractDerPublicKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemContents = pem.replace(/(^\s*-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----\s*$)/g, "")
    // base64 decode the string to get the binary data
    const binaryDerString = atob(pemContents)
    const binaryDer = new Uint8Array(binaryDerString.length)
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i)
    }
    return binaryDer
}

export async function encrypt({ text, key, options }) {
    const derValues = extractDerPublicKey(key)
    
    const keyObj = await crypto.subtle.importKey(
        "spki",
        derValues,
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
            ...options,
        },
        true,
        ["encrypt"],
    )
    const encryptedData = new Uint8Array(await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
            hash: "SHA-256" 
        },
        keyObj,
        new TextEncoder().encode(text),
    ))
    return encodeBase64(encryptedData)
}

// from Medium.com tutorial for Deno
export async function generateKeys(options) {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
            ...options,
        },
        true,
        [ "encrypt", "decrypt" ],
    )

    var privateKey = encodeBase64(new Uint8Array(await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey,
    )))

    var publicKey = encodeBase64(new Uint8Array(await crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey,
    )))

    return { publicKey, privateKey }
}

// adapted MDN example for private keys
function extractDerPrivateKey(pem) {
    const pemContents = pem.replace(/(^\s*-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----\s*$)/g, "")
    const binaryDerString = atob(pemContents)
    const binaryDer = new Uint8Array(binaryDerString.length)
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i)
    }
    return binaryDer
}

export async function decrypt({ text, key, options }) {
    const derValues = extractDerPrivateKey(key)
    
    const keyObj = await crypto.subtle.importKey(
        "pkcs8",
        derValues,
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256" ,
            ...options,
        },
        true,
        ["decrypt"],
    )
    const decryptedData = new Uint8Array(await crypto.subtle.decrypt(
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
            ...options,
        },
        keyObj,
        decodeBase64(text),
    ))
    return new TextDecoder().decode(new Uint8Array(decryptedData))
}