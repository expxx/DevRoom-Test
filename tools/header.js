const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the header from header.txt
async function getHeader() {
    return await axios.get('https://raw.githubusercontent.com/TheCavernStudios/Licenses/refs/heads/main/osl/header')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching header:', error);
            process.exit(1);
        });
}
// Function to apply the header to a file
function applyHeaderToFile(filePath, header) {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Check if the header is already present to avoid duplication
    header = header.replace('{{FILE_NAME}}', path.basename(filePath));
    header = header.replace('{{YEAR}}', new Date().getFullYear());
    header = header.replace('{{PROJECT}}', require('../package.json').name);
    if (!fileContent.startsWith(header)) {
        const newContent = header + fileContent;
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Header applied to: ${filePath}`);
    } else {
        console.log(`Header already present in: ${filePath}`);
    }
}

// Function to recursively process a directory
function processDirectory(directory, header) {
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Recursively process subdirectories
            processDirectory(itemPath, header);
        } else if (stat.isFile()) {
            // Apply header to files
            applyHeaderToFile(itemPath, header);
        }
    }
}

// Main function
async function main() {
    const directory = process.argv[2]; // Get directory from command line argument

    if (!directory) {
        console.error('Usage: node apply-header.js <directory>');
        process.exit(1);
    }

    if (!fs.existsSync(directory)) {
        console.error(`Directory does not exist: ${directory}`);
        process.exit(1);
    }

    const header = await getHeader();
    console.log(`Applying header to files in: ${directory}`);
    processDirectory(directory, header);
    console.log('Header application complete.');
}

// Run the script
main();