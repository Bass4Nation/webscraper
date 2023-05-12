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
const filesToCopy = [
  {
    source: path.join(__dirname, 'server.ts'),
    target: path.join(process.cwd(), 'server.ts')
  },
  {
    source: path.join(__dirname, 'tsconfig-webscraper.json'),
    target: path.join(process.cwd(), 'tsconfig-webscraper.json')
  }
];

for (const file of filesToCopy) {
  fs.copyFileSync(file.source, file.target);
}

console.log('Copied server.js and tsconfig-webscraper.json to the target project\'s root directory.');

// Copy the components, helper, styles, and hooks folders from your framework to the target project's root directory
const foldersToCopy = ['components', 'styles', 'scrapers', 'hooks','routes'];
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

const foldersToCreate = ['public/scraped-json', 'public/scraped-txt', 'public/scraped-screenshots', 'public/scraped-pdfs', 'public/scraped-products', 'public/scraped-products/screenshots', 'public/scraped-products/pdfs'];

for (const folder of foldersToCreate) {
  const folderPath = path.join(process.cwd(), folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created ${folder} folder in the target project.`);
  } else {
    console.log(`${folder} folder already exists in the target project.`);
  }
}
