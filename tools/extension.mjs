import { info, error } from "console";
import childProcess from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import fs from "fs";
import yargs from "yargs";
import { processFiles, signFile } from "./sigUtil.mjs"; // Ensure sigUtil is also in .mjs format
import inquirer from 'inquirer';


// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the private key
const privateKey = fs.readFileSync("codesigning.key", "utf8"); // Path to your private key

// Parse command-line arguments
const argv = yargs(process.argv.slice(2))
    .option("exclude-folder", {
        alias: "ef",
        type: "array",
        description: "Folders to exclude",
        default: [],
    })
    .option("exclude-file", {
        alias: "exf",
        type: "array",
        description: "Files to exclude",
        default: [],
    })
    .demandCommand(1)
    .usage("Usage: node extension.mjs <sourceDir> [options]")
    .help().argv;

// Main function
async function main() {
    // Run tsc while in the "extensions" directory
    const child = childProcess.exec("tsc", { cwd: path.join(__dirname, "/../extensions") });

    // Wait for the process to finish
    await new Promise((resolve) => {
        child.on("exit", (code) => {
            if (code !== 0) {
                error("Failed to compile extensions");
                process.exit(1);
            }
            info("Compiled extensions");
            resolve();
        });
    });

    // Get the input directory from the first argument
    const sourceDir = argv._[0];
    if (!sourceDir) {
        // read stdin for sourceDir
        await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'sourceDir',
                    message: 'Enter the source directory',
                }
            ])
            .then((answers) => {
                sourceDir = answers.sourceDir;
            });
    }

    // Get excluded folders and files
    const excludeFolders = argv["exclude-folder"];
    const excludeFiles = argv["exclude-file"];

    // Resolve the absolute path of the source directory
    const sourceDir2 = path.resolve(sourceDir);
    console.log(chalk.green(`[INFO] Source directory: ${sourceDir2}`));
    const extDir = path.join(__dirname, "../extensions/dist");
    console.log(chalk.green(`[INFO] Extension directory: ${extDir}`));
    const absSourceDir = path.join(extDir, sourceDir);
    console.log(chalk.green(`[INFO] Absolute source directory: ${absSourceDir}`));

    // Start processing files
    console.log(chalk.green(`[INFO] Hashing files in ${absSourceDir}...`));
    const allHashes = await processFiles(absSourceDir, excludeFolders, excludeFiles);

    // Write all hashes to sourceDir/hashes.txt
    const hashesFilePath = path.join(absSourceDir, "hashes.txt");
    fs.writeFileSync(hashesFilePath, allHashes.join("\n"));

    console.log(chalk.green(`[SUCCESS] Hashes saved to ${hashesFilePath}`));

    // Sign the hashes.txt file
    console.log(chalk.green(`[INFO] Signing hashes.txt...`));
    const signature = await signFile(hashesFilePath, privateKey);

    // Write the signature to sourceDir/hashes.txt.sig
    const sigFilePath = `${hashesFilePath}.sig`;
    fs.writeFileSync(sigFilePath, signature);

    console.log(chalk.green(`[SUCCESS] Signature saved to ${sigFilePath}`));
}

// Run the script
main();