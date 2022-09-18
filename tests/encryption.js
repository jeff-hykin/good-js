#!/usr/bin/env -S deno run --allow-all
import { generateKeys, encrypt, decrypt } from "../source/encryption.js"

var message = "Hello World"
var keys = await generateKeys()

// string key
console.debug(`keys.publicKey is:`,keys.publicKey)

// encrypt & decrypt
var encryptedString = await encrypt({ text: message, key: keys.publicKey })
var decryptedString = await decrypt({ text: encryptedString, key: keys.privateKey })
console.debug(`decryptedString is:`,decryptedString)