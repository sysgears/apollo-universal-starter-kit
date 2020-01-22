const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const {
  getModulePackageName,
  computeModulePath,
  getModulesEntryPoint,
  computeRootModulesPath,
  computePackagePath,
  computeModulePackageName,
  computeGeneratedSchemasPath,
  deleteFromFileWithExports,
  removeSymlink,
  runPrettier
} = require('../helpers/util');

/**
 * Removes the module from client, server or both locations and removes the module from the module list.
 *
 * @param logger - The Logger
 * @param packageName - Name of the package the module adding to ([client|server])
 * @param moduleName - The name of a new module
 * @param old - The flag that describes if the command invoked for a new structure or not
 */
function deleteModule({ logger, packageName, moduleName, old }) {
  const modulePackageName = getModulePackageName(packageName, old);
  const modulePath = computeModulePath(modulePackageName, old, moduleName);
  const params = { logger, moduleName, modulePath, packageName, modulePackageName, old };

  if (fs.existsSync(modulePath)) {
    deleteTemplates(params);
    removeFromModules(params);
    if (!old) removeDependency(params);

    logger.info(chalk.green(`✔ Module ${moduleName} for package ${packageName} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${moduleName} for package ${packageName} not found!`));
  }
}

////////// DELETE MODULE STEPS //////////

/**
 * Removes templates from the module.
 */
function deleteTemplates({ logger, moduleName, modulePath, modulePackageName, old }) {
  logger.info(`Deleting ${modulePackageName} files…`);
  // remove module directory
  shell.rm('-rf', modulePath);

  // in new module structure remove root dir if no submodules exist
  if (!old) {
    const rootModulePath = computeRootModulesPath(moduleName);
    if (!shell.ls(rootModulePath).length) {
      shell.rm('-rf', rootModulePath);
    }
  }
  logger.info(chalk.green(`✔ The ${modulePackageName} files of the module ${moduleName} have been deleted!`));
}

/**
 * Removes module from modules entry file.
 */
function removeFromModules({ logger, moduleName, packageName, modulePackageName, old }) {
  // Gets modules entry point file path
  const modulesEntry = getModulesEntryPoint(packageName, old);

  let indexContent;

  try {
    indexContent = fs.readFileSync(modulesEntry);
  } catch (e) {
    logger.error(chalk.red(`Failed to read ${modulesEntry} file`));
    process.exit();
  }

  // Extract application modules
  const appModuleRegExp = /Module\(([^()]+)\)/g;
  const [, appModules] = appModuleRegExp.exec(indexContent) || ['', ''];
  const appModulesWithoutDeleted = appModules.split(',').filter(appModule => appModule.trim() !== moduleName);

  const contentWithoutDeletedModule = indexContent
    .toString()
    // Remove module from modules list
    .replace(appModuleRegExp, `Module(${appModulesWithoutDeleted.toString().trim()})`)
    // Remove module import
    .replace(
      RegExp(`import ${moduleName} from '${computeModulePackageName(moduleName, modulePackageName, old)}';\n`, 'g'),
      ''
    );

  fs.writeFileSync(modulesEntry, contentWithoutDeletedModule);
  runPrettier(modulesEntry);
}

/**
 * Removes the module from the dependencies list.
 */
function removeDependency({ moduleName, packageName, modulePackageName, old }) {
  // Get package content
  const packagePath = computePackagePath(packageName);
  const packageContent = `` + fs.readFileSync(packagePath);

  // Extract dependencies
  const dependenciesRegExp = /"dependencies":\s\{([^()]+)\},\n\s+"devDependencies"/g;
  const [, dependencies] = dependenciesRegExp.exec(packageContent) || ['', ''];

  // Remove package
  const dependenciesWithoutDeleted = dependencies
    .split(',')
    .filter(pkg => !pkg.includes(computeModulePackageName(moduleName, modulePackageName, old)));

  // Remove module from package list
  shell
    .ShellString(
      packageContent.replace(
        RegExp(dependenciesRegExp, 'g'),
        `"dependencies": {${dependenciesWithoutDeleted}},\n  "devDependencies"`
      )
    )
    .to(packagePath);

  removeSymlink(moduleName, modulePackageName);

  const Module = pascalize(moduleName);
  const fileName = 'generatedSchemas.js';
  const generatedSchemaPath = computeGeneratedSchemasPath(packageName, fileName, old);
  if (fs.existsSync(generatedSchemaPath)) {
    const schema = `${Module}Schema`;
    deleteFromFileWithExports(generatedSchemaPath, schema);
  }
}

module.exports = deleteModule;
