const fs = require('fs');
const glob = require('glob');
const path = require('path');

const modulesDir = __dirname + '/../../modules';
const virtualDirs = {
  [path.resolve('/module-migrations')]: glob.sync(path.join(modulesDir, '**/migrations')),
  [path.resolve('/module-seeds')]: glob.sync(path.join(modulesDir, '**/seeds'))
};
const virtualFiles = {};

for (const virtualDir of Object.keys(virtualDirs)) {
  const realDirs = virtualDirs[virtualDir];
  for (const realDir of realDirs) {
    const realFiles = fs.readdirSync(realDir);
    for (const file of realFiles) {
      virtualFiles[path.join(virtualDir, file).replace(/\\/g, '/')] = path.join(realDir, file);
    }
  }
}

module.exports = (modPath, options) => {
  if (modPath.indexOf('module-migrations') >= 0 || modPath.indexOf('module-seeds') >= 0) {
    return virtualFiles[modPath];
  } else {
    return options.defaultResolver(modPath, options);
  }
};
