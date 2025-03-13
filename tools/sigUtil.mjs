import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';

// Function to hash a file using SHA-512
function hashFile(filePath) {
	const fileData = fs.readFileSync(filePath);
	const hash = crypto.createHash('sha512').update(fileData).digest('hex');
	return hash;
}

// Function to process files and directories recursively
function processFiles(dir, excludeFolders, excludeFiles) {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	const allHashes = [];

	for (const file of files) {
		if (
			file.name.includes('hashes.txt') ||
			file.name.includes('hashes.txt.sig')
		) {
			console.log(chalk.yellow(`[SKIP] Excluded file: ${file.name}`));
			continue;
		}
		const filePath = path.join(dir, file.name);

		// Skip excluded folders and files
		if (file.isDirectory() && excludeFolders.includes(file.name)) {
			console.log(chalk.yellow(`[SKIP] Excluded folder: ${file.name}`));
			continue;
		}
		if (!file.isDirectory() && excludeFiles.includes(file.name)) {
			console.log(chalk.yellow(`[SKIP] Excluded file: ${file.name}`));
			continue;
		}

		try {
			if (file.isDirectory()) {
				console.log(chalk.magenta(`[DIR] Entering: ${file.name}`));
				const subDirHashes = processFiles(
					filePath,
					excludeFolders,
					excludeFiles
				); // Recursively process directories
				allHashes.push(...subDirHashes);
			} else {
				console.log(chalk.blueBright(`[FILE] Processing: ${file.name}`));
				const fileHash = hashFile(filePath); // Hash the file
				const relativePath = path.relative(path.dirname('hashes.txt'), filePath);
				allHashes.push(`${relativePath}: ${fileHash}`); // Store relative file path and hash
			}
		} catch (error) {
			console.error(chalk.red(`[ERROR] ${error.message}`));
		}
	}

	return allHashes;
}

// Function to sign a file
function signFile(filePath, privateKey) {
	const fileData = fs.readFileSync(filePath);
	const sign = crypto.createSign('SHA256');
	sign.update(fileData);
	sign.end();
	const signature = sign.sign(privateKey, 'base64');
	return signature;
}

export { hashFile, processFiles, signFile };