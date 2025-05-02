import { encode as encodeBase64, decode as decodeBase64 } from "https://deno.land/std@0.156.0/encoding/base64.ts"

const defaultEncryptionOptions = {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
}

const defaultSignatureOptions = {
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 4096, //can be 1024, 2048, or 4096
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
}

export async function generateKeys(arg1={encrpytionKeyOptions:{}, signatureKeyOptions:{}}) {
    var {encrpytionKeyOptions, signatureKeyOptions} = arg1
    const encryptionKeyPair = await crypto.subtle.generateKey(
        {
            ...defaultEncryptionOptions,
            ...encrpytionKeyOptions,
        },
        true,
        [ "encrypt", "decrypt" ],
    )
    const signatureKeyPair = await crypto.subtle.generateKey(
        defaultSignatureOptions,
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["sign", "verify"] //can be any combination of "sign" and "verify"
    )

    return keyObjectToStringKey({
        decryptionKey: encryptionKeyPair.privateKey,
        encryptionKey: encryptionKeyPair.publicKey,
        signatureKey: signatureKeyPair.privateKey,
        verificationKey: signatureKeyPair.publicKey,
    })
}

export async function encrypt({ text, publicKey, options }) {
    var encryptionKey = publicKey
    if (encryptionKey instanceof Object) {
        if (encryptionKey.encryptionKey) {
            encryptionKey = encryptionKey.encryptionKey
        }
    }
    if (typeof encryptionKey == 'string') {
        options = options || {
            ...defaultEncryptionOptions,
        }
        try {
            var { encryptionKey } = await keyStringToKeyObjects({ encryptionKey, encryptionKeyOptions: options })
        } catch (error) {
            console.error(`A string key was provided to an encrypt function, but there was an issue with it. Are you sure it is a public key, and are you sure it was both designed for encryption and followed the given format: ${options}?`)
        }
    }
    const encryptedData = new Uint8Array(await crypto.subtle.encrypt(
        {
            ...defaultEncryptionOptions,
            ...options,
        },
        encryptionKey,
        new TextEncoder().encode(text),
    ))
    return encodeBase64(encryptedData)
}

export async function decrypt({ text, privateKey, options }) {
    var decryptionKey = privateKey
    if (decryptionKey instanceof Object) {
        if (decryptionKey.decryptionKey) {
            decryptionKey = decryptionKey.decryptionKey
        }
    }
    if (typeof decryptionKey == 'string') {
        options = options || {
            ...defaultEncryptionOptions,
        }
        try {
            var { decryptionKey } = await keyStringToKeyObjects({ decryptionKey, decryptionKeyOptions: options })
        } catch (error) {
            console.error(`A string key was provided to an decrypt function, but there was an issue with it. Are you sure it is a private key, and are you sure it was both designed for encryption and followed the given format: ${options}?`)
        }
    }
    const decryptedData = new Uint8Array(await crypto.subtle.decrypt(
        {
            ...defaultEncryptionOptions,
            ...options,
        },
        decryptionKey,
        decodeBase64(text),
    ))
    return new TextDecoder().decode(new Uint8Array(decryptedData))
}

export async function sign({ text, privateKey, options }) {
    var signatureKey = privateKey
    if (signatureKey instanceof Object) {
        if (signatureKey.signatureKey) {
            signatureKey = signatureKey.signatureKey
        }
    }
    if (typeof signatureKey == 'string') {
        options = options || {
            ...defaultSignatureOptions,
        }
        try {
            var { signatureKey } = await keyStringToKeyObjects({ signatureKey, signatureKeyOptions: options })
        } catch (error) {
            console.error(`A string key was provided to an sign() function, but there was an issue with it. Are you sure it is a private key, and are you sure it was both designed for signatures and followed the given format: ${options}?`)
        }
    }
    const signedData = new Uint8Array(await crypto.subtle.sign(
        {
            ...defaultSignatureOptions,
            ...options,
        },
        signatureKey,
        new TextEncoder().encode(text),
    ))
    return encodeBase64(signedData)
}

export async function verify({ signedMessage, whatMessageShouldBe, publicKey, options }) {
    var verificationKey = publicKey
    if (verificationKey instanceof Object) {
        if (verificationKey.verificationKey) {
            verificationKey = verificationKey.verificationKey
        }
    }
    if (typeof verificationKey == 'string') {
        options = options || {
            ...defaultSignatureOptions,
        }
        try {
            var {verificationKey} = await keyStringToKeyObjects({ verificationKey, verificationKeyOptions: options })
        } catch (error) {
            console.error(`A string key was provided to an sign() function, but there was an issue with it. Are you sure it is a private key, and are you sure it was both designed for signatures and followed the given format: ${options}?`)
        }
    }
    // returns boolean 
    return crypto.subtle.verify(
        {
            ...defaultSignatureOptions,
            ...options,
        },
        verificationKey,
        decodeBase64(signedMessage),
        new TextEncoder().encode(whatMessageShouldBe),
    )
}

export async function keyObjectToStringKey({ decryptionKey, encryptionKey, signatureKey, verificationKey }) {
    if (decryptionKey) {
        var decryptionKey = encodeBase64(new Uint8Array(await crypto.subtle.exportKey(
            "pkcs8",
            decryptionKey,
        )))
    }

    if (encryptionKey) {
        var encryptionKey = encodeBase64(new Uint8Array(await crypto.subtle.exportKey(
            "spki",
            encryptionKey,
        )))
    }
    
    if (signatureKey) {
        var signatureKey = encodeBase64(new Uint8Array(await crypto.subtle.exportKey(
            "pkcs8",
            signatureKey,
        )))
    }

    if (verificationKey) {
        var verificationKey = encodeBase64(new Uint8Array(await crypto.subtle.exportKey(
            "spki",
            verificationKey,
        )))
    }
    return { decryptionKey, encryptionKey, signatureKey, verificationKey }
}

export async function keyStringToKeyObjects({ decryptionKey, encryptionKey, decryptionKeyOptions, encryptionKeyOptions,  signatureKey, verificationKey, signatureKeyOptions, verificationKeyOptions, }) {
    let decryptionKeyObject
    if (decryptionKey) {
        const derValues = extractDerPrivateKey(decryptionKey)
        decryptionKeyObject = await crypto.subtle.importKey(
            "pkcs8",
            derValues,
            {
                ...defaultEncryptionOptions,
                ...decryptionKeyOptions,
            },
            true,
            ["decrypt"],
        )
    }

    let encryptionKeyObject
    if (encryptionKey) {
        const derValues = extractDerPublicKey(encryptionKey)
        encryptionKeyObject = await crypto.subtle.importKey(
            "spki",
            derValues,
            {
                ...defaultEncryptionOptions,
                ...encryptionKeyOptions,
            },
            true,
            [ "encrypt",],
        )
    }

    let signatureKeyObject
    if (signatureKey) {
        const derValues = extractDerPrivateKey(signatureKey)
        signatureKeyObject = await crypto.subtle.importKey(
            "pkcs8",
            derValues,
            {
                ...defaultSignatureOptions,
                ...signatureKeyOptions,
            },
            true,
            [ "sign" ],
        )
    }
    
    let verificationKeyObject
    if (verificationKey) {
        const derValues = extractDerPublicKey(verificationKey)
        verificationKeyObject = await crypto.subtle.importKey(
            "spki",
            derValues,
            {
                ...defaultSignatureOptions,
                ...verificationKeyOptions,
            },
            true,
            [ "verify" ],
        )
    }
    
    return { decryptionKey: decryptionKeyObject, encryptionKey: encryptionKeyObject, signatureKey: signatureKeyObject, verificationKey: verificationKeyObject,  }
}

// From MDN (and similar one on discord)
export function extractDerPublicKey(pem) {
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

// adapted MDN example for private keys
export function extractDerPrivateKey(pem) {
    const pemContents = pem.replace(/(^\s*-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----\s*$)/g, "")
    const binaryDerString = atob(pemContents)
    const binaryDer = new Uint8Array(binaryDerString.length)
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i)
    }
    return binaryDer
}

export const hashers = {
    async sha256(message) {
        // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
        const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8) // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("") // convert bytes to hex string
        return hashHex
    },
}

export const simpleSymmetric = {
    async decrypt({message, password}) {
        const key = await _deriveKey(password, salt)
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, message)

        return new Uint8Array(decrypted)
    },
    async encrypt({message, password}) {
        const key = await _deriveKey(password, salt)
        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, message)
        return new Uint8Array(encrypted)
    },
}

// defaults
const salt = new Uint8Array([41, 166, 202, 34, 87, 235, 125, 136, 255, 90, 19, 151, 33, 120, 100, 99])
const iv = new Uint8Array([86, 96, 239, 192, 166, 40, 115, 135, 79, 242, 172, 58]) // AES-GCM IV

// Derive a crypto key from a password using PBKDF2
async function _deriveKey(password, salt) {
    const passwordKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"])

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    )
}