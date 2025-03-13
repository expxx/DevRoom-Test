var AdmZip = require("adm-zip");
const crypto = require("crypto");
const fs = require('fs')
const packageJson = require("../package.json");

const zip = new AdmZip();

zip.addLocalFolder("dist-out/", "dist-out/");
if(process.argv.includes("--include-src")) zip.addLocalFolder("src/", "src/");
zip.addLocalFile("README.txt");
zip.addLocalFile(".env.example");
if(fs.existsSync("LICENSE")) zip.addLocalFile("LICENSE");
delete packageJson["devDependencies"];
delete packageJson["scripts"];
packageJson["scripts"] = {
    "start": "node dist-out/app.js"
};
packageJson.main = "dist-out/app.js";
zip.addFile("package.json", Buffer.from(JSON.stringify(packageJson, null, 2)));
zip.writeZip(`Test-Devroom-${crypto.randomUUID()}.zip`);