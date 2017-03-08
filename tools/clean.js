const fs = require('fs-extra');
const pkg = require('../package.json');

fs.removeSync(pkg.app.frontendBuildDir);
fs.removeSync(pkg.app.backendBuildDir);
