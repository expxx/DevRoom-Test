import axios from "axios";
import crypto from 'crypto';
import fs from 'fs';
import path from "path";
import { debug, fatal, info } from "./logger";

export async function getCodeSigningKey() {
    const key = (await axios.get("https://cdn.thecavern.dev/certs/penguinlicensing/codesig/codesigning.crt")).data;
    const keymd5 = ((await axios.get("https://cdn.thecavern.dev/certs/penguinlicensing/codesig/codesigning.crt.md5")).data as string).split(" ")[0];
    const keysha1 = ((await axios.get("https://cdn.thecavern.dev/certs/penguinlicensing/codesig/codesigning.crt.sha1")).data as string).split(" ")[0];

    // verify md5
    const md5OfKey = crypto.createHash('md5').update(key).digest('hex');
    if (md5OfKey !== keymd5) throw new Error("MD5 of key does not match");

    // verify sha1
    const sha1OfKey = crypto.createHash('sha1').update(key).digest('hex');
    if (sha1OfKey !== keysha1) throw new Error("SHA1 of key does not match");

    return key;
}

export async function verifyCode(code: string, signature: string) {
    const key = await getCodeSigningKey();
    const verifier = crypto.createVerify('sha256');
    verifier.update(code);
    return verifier.verify(key, signature, 'base64');
}

// Function to verify the signature of a file
async function verifySignature(filePath: string, signature: string, publicKey: string): Promise<boolean> {
  const fileData = fs.readFileSync(filePath);
  const verify = crypto.createVerify('SHA256');
  verify.update(fileData);
  return verify.verify(publicKey, signature, 'base64');
}

// Function to hash a file using SHA-512
function hashFile(filePath: string): string {
  const fileData = fs.readFileSync(filePath);
  return crypto.createHash('sha512').update(fileData).digest('hex');
}

// Updated verifyAllFiles method
export async function verifyAllFiles(dir: string): Promise<boolean> {
  if (!dir) dir = path.join(__dirname, "../");

  // Path to the hashes.txt and hashes.txt.sig files
  info(`Verifying files in ${dir}`);
  const hashesFilePath = path.resolve(dir, 'hashes.txt');
  const sigFilePath = path.resolve(dir, `${hashesFilePath}.sig`);

  // Check if hashes.txt and hashes.txt.sig exist
  if (!fs.existsSync(hashesFilePath)) {
    fatal(`hashes.txt not found in ${dir}`);
    return false;
  }
  if (!fs.existsSync(sigFilePath)) {
    fatal(`hashes.txt.sig not found in ${dir}`);
    return false;
  }

  // Verify the signature of hashes.txt
  const signature = fs.readFileSync(sigFilePath, 'utf-8');
  const isSignatureValid = await verifySignature(hashesFilePath, signature, await getCodeSigningKey());
  if (!isSignatureValid) {
    fatal(`Signature verification failed for hashes.txt`);
    return false;
  }
  info(`Signature verification passed for hashes.txt`);

  // Read the hashes.txt file
  const hashesFileContent = fs.readFileSync(hashesFilePath, 'utf-8');
  const hashesMap = new Map<string, string>();

  // Parse the hashes.txt file into a map of file paths to hashes
  for (const line of hashesFileContent.split('\n')) {
    const [filePath, hash] = line.split(': ');
    if (filePath && hash) {
      hashesMap.set(filePath.trim(), hash.trim());
    }
  }

  // Verify each file's hash
  let valid = true;
  for (const [filePath, expectedHash] of hashesMap.entries()) {
    if (!fs.existsSync(filePath)) {
      debug(`File not found: ${filePath}`);
      valid = false;
      break;
    }

    const computedHash = hashFile(filePath);
    if (computedHash !== expectedHash) {
      debug(`Hash mismatch for ${filePath}`);
      valid = false;
      break;
    }
    debug(`Hash verification passed for ${filePath}`);
  }

  return valid;
}