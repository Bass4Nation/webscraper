const fs = require('fs');
const path = require('path');

// Read your framework's package.json
const frameworkPackageJsonPath = path.join(__dirname, 'package.json');
const frameworkPackageJson = JSON.parse(fs.readFileSync(frameworkPackageJsonPath, 'utf8'));

// Read the target project's package.json (one level up from the current directory)
const targetPackageJsonPath = path.join(__dirname, '..', '..', 'package.json');
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
