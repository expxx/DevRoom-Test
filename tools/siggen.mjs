import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { processFiles, signFile } from './sigUtil.mjs';

const argv = yargs(hideBin(process.argv))
	.option('exclude-folder', {
		alias: 'ef',
		type: 'array',
		description: 'Folders to exclude',
		default: [],
	})
	.option('exclude-file', {
		alias: 'exf',
		type: 'array',
		description: 'Files to exclude',
		default: [],
	})
	.demandCommand(1)
	.usage('Usage: node signFiles.js <sourceDir> [options]')
	.help().argv;

// Load the private key
const privateKey = fs.readFileSync('codesigning.key', 'utf8'); // Path to your private key

// Main function
async function main() {
	// Get the input directory from the first argument
	const sourceDir = argv._[0];
	if (!sourceDir) {
		console.error(chalk.red('Usage: node signFiles.js <sourceDir> [options]'));
		process.exit(1);
	}

	// Get excluded folders and files
	const excludeFolders = argv['exclude-folder'];
	const excludeFiles = argv['exclude-file'];

	// Resolve the absolute path of the source directory
	const absSourceDir = path.resolve(sourceDir);

	// Start processing files
	console.log(chalk.green(`[INFO] Hashing files in ${absSourceDir}...`));
	const allHashes = processFiles(absSourceDir, excludeFolders, excludeFiles);

	// Write all hashes to sourceDir/hashes.txt
	const hashesFilePath = path.join(absSourceDir, 'hashes.txt');
	fs.writeFileSync(hashesFilePath, allHashes.join('\n'));

	console.log(chalk.green(`[SUCCESS] Hashes saved to ${hashesFilePath}`));

	// Sign the hashes.txt file
	console.log(chalk.green(`[INFO] Signing hashes.txt...`));
	const signature = signFile(hashesFilePath, privateKey);

	// Write the signature to sourceDir/hashes.txt.sig
	const sigFilePath = `${hashesFilePath}.sig`;
	fs.writeFileSync(sigFilePath, signature);

	console.log(chalk.green(`[SUCCESS] Signature saved to ${sigFilePath}`));
}

// Run the script
main();