const { writeFileSync } = require('fs');
const { version } = require('../package.json');

writeFileSync(
  'src/environments/version.ts',
  `export const appVersion = '${version}';\n`
);
