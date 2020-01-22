const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const {
  getModulePackageName,
  getTemplatesPath,
  copyFiles,
  renameFiles,
  computeModulePath,
  getModulesEntryPoint,
  computePackagePath,
  computeModulePackageName,
  addSymlink,
  runPrettier
} = require('../helpers/util');

/**
 * Adds application module to client or server code and adds it to the module list.
 *
 * @param logger - The Logger
 * @param templatesPath - The path to the templates for a new module
 * @param moduleName - The name of a new module
 */
function addModule({ logger, packageName, moduleName, old, crud = false }) {
  const modulePackageName = getModulePackageName(packageName, old);
  const templatesPath = getTemplatesPath(crud, old);
  const params = { logger, packageName, moduleName, modulePackageName, templatesPath, old };

  copyTemplates(params);
  mergeWithModules(params);
  if (!old) addDependency(params);

  logger.info(chalk.green(`✔ New module ${moduleName} for package ${packageName} successfully created!`));
}

////////// ADD MODULE STEPS //////////

/**
 * Moves templates to newly created module.
 */
function copyTemplates({ logger, moduleName, modulePackageName, templatesPath, old }) {
  logger.info(`Copying ${modulePackageName} files…`);

  // Create new module directory
  const destinationPath = computeModulePath(modulePackageName, old, moduleName);
  const newModule = shell.mkdir('-p', destinationPath);

  // Continue only if directory does not yet exist
  if (newModule.code !== 0) {
    logger.error(chalk.red(`The ${moduleName} directory is already exists.`));
    process.exit();
  }
  // Copy and rename templates in destination directory
  copyFiles(destinationPath, templatesPath, modulePackageName);
  renameFiles(destinationPath, moduleName);

  logger.info(chalk.green(`✔ The ${modulePackageName} files have been copied!`));
}

/**
 * Imports module to modules entry file.
 */
function mergeWithModules({ logger, moduleName, modulePackageName, packageName, old }) {
  // Get modules entry point file path
  const modulesEntry = getModulesEntryPoint(packageName, old);
  let indexContent;

  try {
    // Retrieve the content of the modules.ts
    indexContent =
      `import ${moduleName} from '${computeModulePackageName(moduleName, modulePackageName, old)}';\n` +
      fs.readFileSync(modulesEntry);
  } catch (e) {
    logger.error(chalk.red(`Failed to read ${modulesEntry} file`));
    process.exit();
  }

  // Extract application modules from the modules.ts
  const appModuleRegExp = /Module\(([^()]+)\)/g;
  const [, appModules] = appModuleRegExp.exec(indexContent) || ['', ''];

  // Add a module to app module list
  shell
    .ShellString(indexContent.replace(RegExp(appModuleRegExp, 'g'), `Module(${moduleName}, ${appModules})`))
    .to(modulesEntry);
  runPrettier(modulesEntry);
}

/**
 * Adds new module as a dependency.
 */
function addDependency({ moduleName, modulePackageName, packageName, old }) {
  // Get package content
  const packagePath = computePackagePath(packageName);
  const packageContent = `${fs.readFileSync(packagePath)}`;

  // Extract dependencies
  const dependenciesRegExp = /"dependencies":\s\{([^()]+)\},\n\s+"devDependencies"/g;
  const [, dependencies] = dependenciesRegExp.exec(packageContent) || ['', ''];

  // Insert package and sort
  const dependenciesSorted = dependencies.split(',');
  dependenciesSorted.push(`\n    "${computeModulePackageName(moduleName, modulePackageName, old)}": "^1.0.0"`);
  dependenciesSorted.sort();

  // Add module to package list
  shell
    .ShellString(
      packageContent.replace(
        RegExp(dependenciesRegExp, 'g'),
        `"dependencies": {${dependenciesSorted}},\n  "devDependencies"`
      )
    )
    .to(packagePath);

  addSymlink(moduleName, modulePackageName);
}

module.exports = addModule;
