const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Ensure crypto module is imported

// Configuration
const DIRECTORY = path.join(__dirname, '/../dist'); // Change if needed
const TEXT_TO_INJECT = `\n\nconst %%__RAND__%% = "%%__NONCE__%%"`;
const NUM_FILES = 5;

const injectedFiles = new Map();

function getAllFiles(directory) {
    let fileList = [];

    function walkDir(currentPath) {
        const files = fs.readdirSync(currentPath);

        files.forEach(file => {
            const fullPath = path.join(currentPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                walkDir(fullPath); // Recursively go into subdirectories
            } else if (stat.isFile()) {
                fileList.push(fullPath);
            }
        });
    }

    walkDir(directory);
    return fileList;
}

function getRandomFiles(files, numFiles) {
    if (files.length === 0) {
        console.error('No files found in the directory or subdirectories.');
        process.exit(1);
    }

    return files.sort(() => 0.5 - Math.random()).slice(0, Math.min(numFiles, files.length));
}

function injectTextToFile(filePath, text) {
    const rand = "a" + crypto.randomUUID().split('-').join('');
    fs.appendFileSync(filePath, text.replace('%%__RAND__%%', rand), 'utf8');
    injectedFiles.set(filePath, rand);
    console.log(`Injected text into: ${filePath}`);
}

function main() {
    if (!fs.existsSync(DIRECTORY)) {
        console.error(`Directory does not exist: ${DIRECTORY}`);
        process.exit(1);
    }

    const allFiles = getAllFiles(DIRECTORY);
    const selectedFiles = getRandomFiles(allFiles, NUM_FILES);

    selectedFiles.forEach(file => injectTextToFile(file, TEXT_TO_INJECT));

    console.log('Text injection complete.');
}

// Run the script
main();
