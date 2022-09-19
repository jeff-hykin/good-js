#!/usr/bin/env -S deno run --allow-all
import { generateKeys, encrypt, decrypt, sign, verify, keyStringToKeyObjects, extractDerPrivateKey, extractDerPublicKey } from "../source/encryption.js"

var message = "Hello World"
var keys = await generateKeys()

// // string key
console.debug(`keys is:`,keys)
var objKeys = await keyStringToKeyObjects(keys)
console.debug(`objKeys is:`,objKeys)

// // encrypt & decrypt
var encryptedString = await encrypt({ text: message, publicKey: keys.encryptionKey })
var decryptedString = await decrypt({ text: encryptedString, privateKey: keys.decryptionKey })
console.debug(`decryptedString is:`,decryptedString)


var signed = await sign({ text: message, privateKey: keys.signatureKey })
console.debug(`signed is:`,signed)
var signatureIsBonafide = await verify({ signedMessage: signed, whatMessageShouldBe: message, publicKey: keys.verificationKey })
console.debug(`signatureIsBonafide is:`,signatureIsBonafide)