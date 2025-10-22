/**
 * Sync version from package.json to:
 *  1. src/environments/version.ts
 *  2. angular.json (projects.school.architect.build.options.appVersion)
 */

const fs = require('fs');
const path = require('path');

// --- Read version from package.json ---
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

// --- Write to src/environments/version.ts ---
const envPath = path.resolve(__dirname, '../src/environments/version.ts');
fs.writeFileSync(envPath, `export const appVersion = '${version}';\n`);
console.log(`✅ Updated version.ts → ${version}`);

// --- Update angular.json appVersion ---
const angularPath = path.resolve(__dirname, '../angular.json');
const angularJson = JSON.parse(fs.readFileSync(angularPath, 'utf8'));

if (
  angularJson.projects &&
  angularJson.projects.school &&
  angularJson.projects.school.architect &&
  angularJson.projects.school.architect.build &&
  angularJson.projects.school.architect.build.options
) {
  angularJson.projects.school.architect.build.options.appVersion = version;
  fs.writeFileSync(angularPath, JSON.stringify(angularJson, null, 2));
  console.log(`✅ Updated angular.json appVersion → ${version}`);
} else {
  console.warn('⚠️ Could not find path to projects.school.architect.build.options');
}
