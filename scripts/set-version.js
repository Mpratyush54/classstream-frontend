/**
 * set-version.js
 * Sync version across:
 *  1. package.json
 *  2. src/environments/version.ts
 *  3. angular.json (metadata.appVersion)
 */

const fs = require('fs');
const path = require('path');

// Paths
const pkgPath = path.resolve(__dirname, '../package.json');
const angularPath = path.resolve(__dirname, '../angular.json');
const envPath = path.resolve(__dirname, '../src/environments/version.ts');

// Read package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// 1️⃣ Determine version to set
// Prefer CI-provided env var (SEMANTIC_RELEASE_NEXT_RELEASE_VERSION)
// Fallback to package.json current version
const version = process.env.SEMANTIC_RELEASE_NEXT_RELEASE_VERSION || pkg.version || '0.0.0';

// 2️⃣ Update package.json
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✅ Updated package.json → version ${version}`);

// 3️⃣ Write version.ts (for Angular runtime)
fs.writeFileSync(envPath, `export const appVersion = '${version}';\n`);
console.log(`✅ Updated src/environments/version.ts → ${version}`);

// 4️⃣ Update angular.json metadata section (schema-safe)
const angularJson = JSON.parse(fs.readFileSync(angularPath, 'utf8'));
angularJson.metadata = angularJson.metadata || {};
angularJson.metadata.appVersion = version;

fs.writeFileSync(angularPath, JSON.stringify(angularJson, null, 2) + '\n');
console.log(`✅ Updated angular.json metadata.appVersion → ${version}`);
