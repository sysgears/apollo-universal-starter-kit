const shell = require('shelljs');
const fs = require('fs');
const { pascalize, decamelize } = require('humps');
const { startCase } = require('lodash');
const { BASE_PATH } = require('../config');

/**
 * Copies the templates to the destination directory.
 *
 * @param destinationPath - The destination path for a new module.
 * @param templatesPath - The path to the templates for a new module.
 * @param location - The location for a new module [client|server|both].
 */
function copyFiles(destinationPath, templatesPath, location) {
  shell.cp('-R', `${templatesPath}/${location}/*`, destinationPath);
}

/**
 * Renames the templates in the destination directory.
 *
 * @param destinationPath - The destination path of a new module.
 * @param moduleName - The name of a new module.
 */
function renameFiles(destinationPath, moduleName) {
  const Module = pascalize(moduleName);

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
      shell.sed('-i', /\$module\$/g, moduleName, entry.name);
      shell.sed('-i', /\$_module\$/g, decamelize(moduleName), entry.name);
      shell.sed('-i', /\$Module\$/g, Module, entry.name);
      shell.sed('-i', /\$MoDuLe\$/g, startCase(moduleName), entry.name);
      shell.sed('-i', /\$MODULE\$/g, moduleName.toUpperCase(), entry.name);
    }
  });
}

/**
 * Gets the computed path of the module or modules dir path.
 *
 * @param location - The location for a new module [client|server|both].
 * @param moduleName - The name of a new module.
 * @returns {string} - Return the computed path
 */
function computeModulesPath(location, moduleName = '') {
  return `${BASE_PATH}/packages/${location}/src/modules/${moduleName}`;
}

/**
 * Run prettier on file that was changed.
 *
 * @param pathToFile
 */
function runPrettier(pathToFile) {
  if (fs.existsSync(pathToFile)) {
    shell.exec(`prettier --print-width 120 --single-quote --loglevel error --write ${pathToFile}`);
  }
}

module.exports = {
  renameFiles,
  copyFiles,
  computeModulesPath,
  runPrettier
};
