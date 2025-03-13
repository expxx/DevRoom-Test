/*
 * sig.js
 * 
 * This file is part of the devroom-test project, licensed under The Cavern OSL (Version 1.0).
 * 
 * Copyright (c) 2025 TheCavernStudios. All rights reserved.
 * 
 * License Grant:
 * - Subject to the terms of The Cavern Studios OSL, you are granted a worldwide, royalty-free,
 *   non-exclusive, non-transferable license to use, modify, and privately utilize this file,
 *   including for commercial purposes, under the conditions outlined in the license.
 * 
 * Conditions:
 * - Any modifications made to this file must be disclosed and documented.
 * - This license and all copyright notices must be retained in all copies or substantial portions.
 * - Derivative works must be licensed under the same terms as The Cavern OSL.
 * 
 * Restrictions:
 * - This file may not be shared, distributed, sold, leased, sublicensed, or transferred.
 * - The source code may not be obfuscated or resold in any form.
 * 
 * Limitations:
 * - This file and its source code must remain with the Licensee only and may not be shared with third parties.
 * - The Licensee assumes all risk associated with the use or modification of this file.
 * 
 * For the full license text, refer to the LICENSE file included with this project.
 */

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodeSigningKey = getCodeSigningKey;
exports.verifyCode = verifyCode;
exports.verifyAllFiles = verifyAllFiles;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
async function getCodeSigningKey() {
    const key = (await axios_1.default.get("https://cdn.thecavern.dev/certs/penguinlicensing/codesig/codesigning.crt")).data;
    const keymd5 = (await axios_1.default.get("https://cdn.thecavern.dev/certs/penguinlicensing/codesig/codesigning.crt.md5")).data.split(" ")[0];
    const keysha1 = (await axios_1.default.get("https://cdn.thecavern.dev/certs/penguinlicensing/codesig/codesigning.crt.sha1")).data.split(" ")[0];
    const md5OfKey = crypto_1.default.createHash('md5').update(key).digest('hex');
    if (md5OfKey !== keymd5)
        throw new Error("MD5 of key does not match");
    const sha1OfKey = crypto_1.default.createHash('sha1').update(key).digest('hex');
    if (sha1OfKey !== keysha1)
        throw new Error("SHA1 of key does not match");
    return key;
}
async function verifyCode(code, signature) {
    const key = await getCodeSigningKey();
    const verifier = crypto_1.default.createVerify('sha256');
    verifier.update(code);
    return verifier.verify(key, signature, 'base64');
}
async function verifySignature(filePath, signature, publicKey) {
    const fileData = fs_1.default.readFileSync(filePath);
    const verify = crypto_1.default.createVerify('SHA256');
    verify.update(fileData);
    return verify.verify(publicKey, signature, 'base64');
}
function hashFile(filePath) {
    const fileData = fs_1.default.readFileSync(filePath);
    return crypto_1.default.createHash('sha512').update(fileData).digest('hex');
}
async function verifyAllFiles(dir) {
    if (!dir)
        dir = path_1.default.join(__dirname, "../");
    (0, logger_1.info)(`Verifying files in ${dir}`);
    const hashesFilePath = path_1.default.resolve(dir, 'hashes.txt');
    const sigFilePath = path_1.default.resolve(dir, `${hashesFilePath}.sig`);
    if (!fs_1.default.existsSync(hashesFilePath)) {
        (0, logger_1.fatal)(`hashes.txt not found in ${dir}`);
        return false;
    }
    if (!fs_1.default.existsSync(sigFilePath)) {
        (0, logger_1.fatal)(`hashes.txt.sig not found in ${dir}`);
        return false;
    }
    const signature = fs_1.default.readFileSync(sigFilePath, 'utf-8');
    const isSignatureValid = await verifySignature(hashesFilePath, signature, await getCodeSigningKey());
    if (!isSignatureValid) {
        (0, logger_1.fatal)(`Signature verification failed for hashes.txt`);
        return false;
    }
    (0, logger_1.info)(`Signature verification passed for hashes.txt`);
    const hashesFileContent = fs_1.default.readFileSync(hashesFilePath, 'utf-8');
    const hashesMap = new Map();
    for (const line of hashesFileContent.split('\n')) {
        const [filePath, hash] = line.split(': ');
        if (filePath && hash) {
            hashesMap.set(filePath.trim(), hash.trim());
        }
    }
    let valid = true;
    for (const [filePath, expectedHash] of hashesMap.entries()) {
        if (!fs_1.default.existsSync(filePath)) {
            (0, logger_1.debug)(`File not found: ${filePath}`);
            valid = false;
            break;
        }
        const computedHash = hashFile(filePath);
        if (computedHash !== expectedHash) {
            (0, logger_1.debug)(`Hash mismatch for ${filePath}`);
            valid = false;
            break;
        }
        (0, logger_1.debug)(`Hash verification passed for ${filePath}`);
    }
    return valid;
}


const ae08721855d5f4c909c3a5de9541778cc = "%%__NONCE__%%"