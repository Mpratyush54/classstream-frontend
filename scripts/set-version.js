/**
 * set-version.js
 * Sync version from package.json to:
 *  1. src/environments/version.ts
 *  2. angular.json root-level "appVersion"
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
console.log(`✅ Updated src/environments/version.ts → ${version}`);

// --- Add/update appVersion at root of angular.json (schema-safe) ---
const angularPath = path.resolve(__dirname, '../angular.json');
const angularJson = JSON.parse(fs.readFileSync(angularPath, 'utf8'));

angularJson.appVersion = version; // safe root-level property

fs.writeFileSync(angularPath, JSON.stringify(angularJson, null, 2));
console.log(`✅ Updated angular.json root-level appVersion → ${version}`);
