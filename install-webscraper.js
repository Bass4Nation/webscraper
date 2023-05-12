#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to copy a folder recursively
function copyFolderSync(source, target) {
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  for (const file of fs.readdirSync(source)) {
    const srcPath = path.join(source, file);
    const destPath = path.join(targetFolder, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Read your framework's package.json
const frameworkPackageJsonPath = path.join(__dirname, 'package.json');
const frameworkPackageJson = JSON.parse(fs.readFileSync(frameworkPackageJsonPath, 'utf8'));

// Read the target project's package.json
const targetPackageJsonPath = path.join(process.cwd(), 'package.json');
const targetPackageJson = JSON.parse(fs.readFileSync(targetPackageJsonPath, 'utf8'));

// Merge dependencies
targetPackageJson.dependencies = {
  ...targetPackageJson.dependencies,
  ...frameworkPackageJson.dependencies,
};

// Merge scripts
targetPackageJson.scripts = {
  ...targetPackageJson.scripts,
  ...frameworkPackageJson.scripts,
};

// Write the updated package.json back to the target project
fs.writeFileSync(targetPackageJsonPath, JSON.stringify(targetPackageJson, null, 2));

console.log('The target project\'s package.json has been updated.');

// Copy server.js from your framework to the target project's root directory
const serverSourcePath = path.join(__dirname, 'server.ts');
const serverTargetPath = path.join(process.cwd(), 'server.ts');
fs.copyFileSync(serverSourcePath, serverTargetPath);

console.log('Copied server.js to the target project\'s root directory.');

// Copy the components, helper, styles, and hooks folders from your framework to the target project's root directory
const foldersToCopy = ['components', 'styles', 'scrapers', 'hooks'];
for (const folder of foldersToCopy) {
  const folderSourcePath = path.join(__dirname, folder);
  const folderTargetPath = process.cwd();

  if (fs.existsSync(folderSourcePath)) {
    copyFolderSync(folderSourcePath, folderTargetPath);
    console.log(`Copied ${folder} folder to the target project's root directory.`);
  } else {
    console.warn(`Warning: The ${folder} folder was not found in your framework.`);
  }
}

// Install all dependencies
try {
  console.log('Installing dependencies, please wait...');
  execSync('npm install', { stdio: 'inherit' }); // Install dependencies
  execSync('npm i concurrently', { stdio: 'inherit' }); // Install concurrently
  execSync('npm i ts-node', { stdio: 'inherit' }); // Install ts-node for running server.ts (node doesn't support typescript natively)
  execSync('npm i --save -dev @types/user-agents', { stdio: 'inherit' }); // Install ts-node for running server.ts (node doesn't support typescript natively)
  execSync('npm i --save-dev @types/cors', { stdio: 'inherit' }); // Install ts-node for running server.ts (node doesn't support typescript natively)
  console.log('Dependencies installed successfully.');
} catch (error) {
  console.error('Error installing dependencies:', error);
}

const foldersToCreate = ['public/scraped-json', 'public/scraped-txt', 'public/scraped-screenshots', 'public/scraped-pdfs', 'public/scraped-products', 'public/scraped-products/screenshots'];

for (const folder of foldersToCreate) {
  const folderPath = path.join(process.cwd(), folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created ${folder} folder in the target project.`);
  } else {
    console.log(`${folder} folder already exists in the target project.`);
  }
}


// // Create public/scraped-screenshots folder if it doesn't exist
// const scrapedScreenshotsFolderPath = path.join(process.cwd(), 'public', 'scraped-screenshots', 'public/scraped-pdfs');
// if (!fs.existsSync(scrapedScreenshotsFolderPath)) {
//   fs.mkdirSync(scrapedScreenshotsFolderPath, { recursive: true });
//   console.log('Created public/scraped-screenshots folder in the target project.');
// } else {
//   console.log('public/scraped-screenshots folder already exists in the target project.');
// }

// // Create public/scraped-pdfs folder if it doesn't exist
// const scrapedPdfsFolderPath = path.join(process.cwd(), 'public', 'scraped-pdfs');
// if (!fs.existsSync(scrapedPdfsFolderPath)) {
//   fs.mkdirSync(scrapedPdfsFolderPath, { recursive: true });
//   console.log('Created public/scraped-pdfs folder in the target project.');
// } else {
//   console.log('public/scraped-pdfs folder already exists in the target project.');
// }

// // Create public/scraped-pdfs folder if it doesn't exist
// const scrapedJsonFolderPath = path.join(process.cwd(), 'public', 'scraped-json');
// if (!fs.existsSync(scrapedJsonFolderPath)) {
//   fs.mkdirSync(scrapedJsonFolderPath, { recursive: true });
//   console.log('Created public/scraped-json folder in the target project.');
// } else {
//   console.log('public/scraped-json folder already exists in the target project.');
// }


// // Create public/scraped-pdfs folder if it doesn't exist
// const scrapedTxtFolderPath = path.join(process.cwd(), 'public', 'scraped-txt');
// if (!fs.existsSync(scrapedTxtFolderPath)) {
//   fs.mkdirSync(scrapedTxtFolderPath, { recursive: true });
//   console.log('Created public/scraped-txts folder in the target project.');
// } else {
//   console.log('public/scraped-txt folder already exists in the target project.');
// }

