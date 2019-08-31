const shell = require('shelljs');
const fs = require('fs');
const { pascalize, decamelize } = require('humps');
const { startCase } = require('lodash');
const { MODULE_TEMPLATES, MODULE_TEMPLATES_OLD, BASE_PATH } = require('../config');

/**
 * Provides a package name for the particular module based on the command option --old .
 *
 * @param packageName - The application package ([client|server])
 * @param old - The flag that describes if the command invoked for a new structure or not
 * @returns {string} - package name based on the command option --old ('client-react', 'server-ts' etc.)
 */
const getModulePackageName = (packageName, old) => {
  return `${packageName}${old ? '' : packageName === 'server' ? '-ts' : '-react'}`;
};

/**
 * Provides a path to the module templates.
 *
 * @param old - The flag that describes if the command invoked for a new structure or not
 * @returns {string} - path to the templates
 */
const getTemplatesPath = old => (old ? MODULE_TEMPLATES_OLD : MODULE_TEMPLATES);

/**
 * Copies the templates to the destination directory.
 *
 * @param destinationPath - The destination path for a new module.
 * @param templatesPath - The path to the templates for a new module.
 * @param modulePackageName - The application package ([client|server])
 */
function copyFiles(destinationPath, templatesPath, modulePackageName) {
  shell.cp('-R', `${templatesPath}/${modulePackageName}/*`, destinationPath);
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
 * Gets the computed path of the new module.
 *
 * @param packageName - The application package ([client|server])
 * @param old - The flag that describes if the command invoked for a new structure or not
 * @param moduleName - The name of a new module
 * @returns {string} - Returns the computed path
 */
const computeModulePath = (packageName, old, moduleName) => {
  return old
    ? `${BASE_PATH}/packages/${packageName}/src/modules/${moduleName}`
    : `${BASE_PATH}/modules/${moduleName}/${packageName}`;
};

/**
 * Finds and returns a file found in a specific path by regexp.
 *
 * @param path - The path where the file is supposed to be located in
 * @param matcher - The regexp for finding the file
 * @returns {string} - Returns the found file name, otherwise `undefined`
 */
const findFileInPath = (path, matcher) => fs.readdirSync(path).find(_ => _.match(matcher));

/**
 * Gets the path of the modules entry point.
 *
 * @param packageName - The application package ([client|server])
 * @param old - The flag that describes if the command invoked for a new structure or not
 * @returns {string} - Returns the computed path
 */
const getModulesEntryPoint = (packageName, old) => {
  const src = `${BASE_PATH}/packages/${packageName}/src`;
  const oldSrc = `${src}/modules`;

  return old ? `${oldSrc}/${findFileInPath(oldSrc, /index\..+/)}` : `${src}/${findFileInPath(src, /modules\..+/)}`;
};

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
 * @param moduleName - The name of a new module
 * @param packageName - The application package ([client|server])
 * @param old - The flag that describes if the command invoked for a new structure or not
 * @returns {string} - Return the computed path
 */
function computeModulePackageName(moduleName, packageName, old) {
  return old ? `./${moduleName}` : `@gqlapp/${decamelize(moduleName, { separator: '-' })}-${packageName}`;
}

/**
 * Gets the computed package path for the module.
 *
 * @param packageName - The application package ([client|server])
 * @returns {string} - Return the computed path
 */
function computePackagePath(packageName) {
  return `${BASE_PATH}/packages/${packageName}/package.json`;
}

/**
 * Adds a symlink.
 *
 * @param packageName - The application package ([client|server])
 * @param modulePackageName - The name of the package of a new module ([client-react|server-ts] etc.)
 */
function addSymlink(packageName, modulePackageName) {
  fs.symlinkSync(
    `${BASE_PATH}/modules/${packageName}/${modulePackageName}`,
    `${BASE_PATH}/node_modules/@gqlapp/${decamelize(packageName, { separator: '-' })}-${modulePackageName}`
  );
}

/**
 * Remove symlink
 *
 * @param packageName - The application package ([client|server])
 * @param modulePackageName - The name of the package of a new module ([client-react|server-ts] etc.)
 */
function removeSymlink(packageName, modulePackageName) {
  fs.unlinkSync(
    `${BASE_PATH}/node_modules/@gqlapp/${decamelize(packageName, { separator: '-' })}-${modulePackageName}`
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

/**
 * Takes to the directory using its name
 *
 * @param directory - The name of directory
 * @returns {string} - The path to current directory
 */
function moveToDirectory(directory) {
  shell.cd(`${BASE_PATH}/${directory}/`);
  return shell.pwd().stdout;
}

/**
 * Deletes the directory
 *
 * @param path - The path of the directory
 */
function deleteDir(path) {
  try {
    shell.rm('-rf', path);
  } catch (e) {
    console.error(`The directory ${path} for the stack was not found`);
  }
}

/**
 * Gets a list of subdirectory paths
 *
 * @param path - The path to the directory
 * @returns {string} - List of directories paths
 */
function getPathsSubdir(path) {
  const subdirPathList = [];
  const subdirs = fs.readdirSync(path);

  subdirs.forEach(subdir => {
    if (!fs.statSync(`${path}/${subdir}`).isFile()) {
      return subdirPathList.push(`${path}/${subdir}`);
    }
  });

  return subdirPathList;
}

/**
 * Deletes directories for unused stacks
 *
 * @param stackDirList - List of directories for unused stacks
 */
function deleteStackDir(stackDirList) {
  const route = moveToDirectory('modules');
  const subdirList = getPathsSubdir(route);
  stackDirList.forEach(stack => {
    deleteDir(`${BASE_PATH}/packages/${stack}`);
    subdirList.forEach(dir => {
      deleteDir(`${dir}/${stack}`);
    });
  });
}

module.exports = {
  getModulePackageName,
  getTemplatesPath,
  renameFiles,
  copyFiles,
  computeModulePath,
  findFileInPath,
  getModulesEntryPoint,
  computeRootModulesPath,
  computePackagePath,
  computeModulePackageName,
  addSymlink,
  removeSymlink,
  runPrettier,
  moveToDirectory,
  deleteDir,
  getPathsSubdir,
  deleteStackDir
};
