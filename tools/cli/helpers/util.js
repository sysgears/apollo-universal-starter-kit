const shell = require('shelljs');
const { pascalize, decamelize } = require('humps');
const { startCase } = require('lodash');
const { BASE_PATH } = require('../config');

/**
 * Copy templates to the destination directory
 * @param destinationPath
 * @param templatePath
 * @param location
 */
function copyFiles(destinationPath, templatePath, location) {
  shell.cp('-R', `${templatePath}/${location}/*`, destinationPath);
}

/**
 * Rename templates in the destination directory
 * @param destinationPath
 * @param module
 */
function renameFiles(destinationPath, module) {
  const Module = pascalize(module);

  // change to destination directory
  shell.cd(destinationPath);

  // rename files
  shell.ls('-Rl', '.').forEach(entry => {
    if (entry.isFile()) {
      shell.mv(entry.name, entry.name.replace('Module', Module));
    }
  });

  // replace module names
  shell.ls('-Rl', '.').forEach(entry => {
    if (entry.isFile()) {
      shell.sed('-i', /\$module\$/g, module, entry.name);
      shell.sed('-i', /\$_module\$/g, decamelize(module), entry.name);
      shell.sed('-i', /\$Module\$/g, Module, entry.name);
      shell.sed('-i', /\$MoDuLe\$/g, startCase(Module), entry.name);
      shell.sed('-i', /\$MODULE\$/g, module.toUpperCase(), entry.name);
    }
  });
}

/**
 * Get computed module or modules path
 * @param location
 * @param module
 * @returns {string}
 */
function computeModulesPath(location, module = '') {
  return `${BASE_PATH}/packages/${location}/src/modules/${module}`;
}

module.exports = {
  renameFiles,
  copyFiles,
  computeModulesPath
};
