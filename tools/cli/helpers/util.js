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
      shell.sed('-i', /\$-module\$/g, decamelize(moduleName, { separator: '-' }), entry.name);
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
function computeModulesPath(location, options, moduleName = '') {
  return options.old || (moduleName === '' && location.split('-')[0] === 'server')
    ? `${BASE_PATH}/packages/${location.split('-')[0]}/src/modules/${moduleName}`
    : moduleName === ''
      ? `${BASE_PATH}/packages/${location.split('-')[0]}/src/`
      : `${BASE_PATH}/modules/${moduleName}/${location}`;
}

/**
 * Gets the computed path of the root module path.
 *
 * @param moduleName - The name of a new module.
 * @returns {string} - Return the computed path
 */
function computeRootModulesPath(moduleName) {
  return `${BASE_PATH}/modules/${moduleName}`;
}

/**
 * Gets the computed package path for the module.
 *
 * @param moduleName - The name of a new module.
 * @param location - The location for a new module [client|server|both].
 * @returns {string} - Return the computed path
 */
function computeModulePackageName(location, options, moduleName) {
  return options.old
    ? `./${moduleName}`
    : `@module/${decamelize(moduleName, {
        separator: '-'
      })}-${location}`;
}

/**
 * Gets the computed package path for the module.
 *
 * @param moduleName - The name of a new module.
 * @returns {string} - Return the computed path
 */
function computePackagePath(location) {
  return `${BASE_PATH}/packages/${location.split('-')[0]}/package.json`;
}

/**
 * Add symlink
 *
 * @param moduleName - The name of a new module.
 * @param location - The location for a new module [client|server].
 */
function addSymlink(location, moduleName) {
  shell.ln(
    '-s',
    `${BASE_PATH}/modules/${moduleName}/${location}`,
    `${BASE_PATH}/node_modules/@module/${decamelize(moduleName, {
      separator: '-'
    })}-${location}`
  );
}

/**
 * Remove symlink
 *
 * @param moduleName - The name of a new module.
 * @param location - The location for a new module [client|server].
 */
function removeSymlink(location, moduleName) {
  shell.rm(
    `${BASE_PATH}/modules/${moduleName}/${location}`,
    `${BASE_PATH}/node_modules/@module/${decamelize(moduleName, {
      separator: '-'
    })}-${location}`
  );
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
  computeRootModulesPath,
  computePackagePath,
  computeModulePackageName,
  addSymlink,
  removeSymlink,
  runPrettier
};
