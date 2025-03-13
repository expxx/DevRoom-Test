import chalk from 'chalk';
import JsConfuser from 'js-confuser';
import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { Buffer } from 'buffer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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
  .option('fake', {
    alias: 'f',
    type: 'boolean',
    description: 'Whether or not to skip obfuscation',
    default: false,
  })
  .demandCommand(2)
  .usage('Usage: node file.js <sourceDir> <outputDir> [options]')
  .help()
  .argv;

async function obfuscateProject(sourceDir, outputDir, excludeFolders, excludeFiles, fake) {
  const absSource = path.resolve(sourceDir);
  const absOutput = path.resolve(outputDir);

  console.log(chalk.green(`[INFO] Copying files from ${absSource} to ${absOutput}...`));
  await fsExtra.copy(absSource, absOutput);

  if(!fake) {
    await processFiles(absOutput, excludeFolders, excludeFiles);
  }
}

async function processFiles(dir, excludeFolders, excludeFiles) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
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
        await processFiles(filePath, excludeFolders, excludeFiles);
      } else if (path.extname(file.name) === '.js') {
        console.log(chalk.blueBright(`[FILE] Processing: ${file.name}`));

        const shouldSkipObf = await searchAndRemoveAntiObf(filePath);
        if (shouldSkipObf) continue;

        const src = fs.readFileSync(filePath, 'utf-8');
        const obfuscatedCode = await obfuscateCode(src);

        fs.writeFileSync(filePath, Buffer.from(obfuscatedCode));
      }
    } catch (error) {
      console.error(chalk.red(`[ERROR] ${error.message}`));
    }
  }
}

async function obfuscateCode(sourceCode) {
  return JsConfuser.obfuscate(sourceCode, {
    target: 'node',
    pack: false, // CHANGED FROM FALSE TO TRUE -- DOES NOT WORK

    identifierGenerator: 'zeroWidth', // CHANGED FROM 'hexadecimal' TO 'zeroWidth' -- WORKS
    renameVariables: (name) => generateObfuscatedName(name),
    renameGlobals: true, // CHANGED FROM FALSE TO TRUE -- WORKS
    renameLabels: true,  // CHANGED FROM FALSE TO TRUE -- WORKS
    movedDeclarations: true,

    stringCompression: false, // CHANGED FROM FALSE TO TRUE -- DOES NOT WORK
    stringConcealing: (str) => shouldObfuscateString(str, 'concealing'),
    stringEncoding: (str) => shouldObfuscateString(str, 'encoding'),
    stringSplitting: false,

    calculator: true, // CHANGED FROM FALSE TO TRUE -- WORKS
    objectExtraction: true,
    globalConcealing: true,
    shuffle: true,
    duplicateLiteralsRemoval: true, // CHANGED FROM FALSE TO TRUE -- WORKS

    controlFlowFlattening: true, // CHANGED FROM FALSE TO TRUE -- WORKS
    dispatcher: true,
    opaquePredicates: true,
    deadCode: true,
    astScrambler: true, // CHANGED FROM FALSE TO TRUE -- WORKS

    variableMasking: true, // CHANGED FROM FALSE TO TRUE -- WORKS
    flatten: true,
    rgf: false, // CHANGED FROM FALSE TO TRUE -- WORKS -- Genuinely not worth it though

    lock: {
      domainLock: false,
      startDate: false,
      endDate: false,
      tamperProtection: false,
      selfDefending: true,
      integrity: true,
      antiDebug: true,
    },

    hexadecimalNumbers: true,
    compact: true,
    minify: true,
  }).then((result) => result.code);
}

function generateObfuscatedName(name) {
  const salt = Math.random().toString(36).substring(7);
  const hash = crypto.createHash('sha256').update(name + salt).digest('hex');
  return hash.substring(0, 10);
}

async function searchAndRemoveAntiObf(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');
    const searchMarker = '// DNOBF';
    const updatedLines = lines.filter((line) => !line.includes(searchMarker));

    if (updatedLines.length !== lines.length) {
      fs.writeFileSync(filePath, updatedLines.join('\n'));
      return true;
    }
    return false;
  } catch (error) {
    console.error(chalk.red(`[ERROR] ${error.message}`));
    return false;
  }
}

function shouldObfuscateString(string, type) {
  if (!string) return true;
  if (string.startsWith('%%__')) {
    console.log(chalk.redBright(`[STRING] Excluding ${string} from obfuscation (${type})`));
    return false;
  }
  return true;
}

// Get arguments
const [sourceDir, outputDir] = argv._;
const excludeFolders = argv['exclude-folder'];
const excludeFiles = argv['exclude-file'];
const fake = argv['fake'];

// Start the process
obfuscateProject(sourceDir, outputDir, excludeFolders, excludeFiles, fake);
