const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const {
  getPackageName,
  computeModulePath,
  getModulesEntryPoint,
  computeRootModulesPath,
  computePackagePath,
  computeModulePackageName,
  removeSymlink,
  runPrettier
} = require('../helpers/util');

/**
 * Removes the module from client, server or both locations and removes the module from the module list.
 *
 * @param logger - The Logger.
 * @param moduleName - The name of a new module.
 */
function deleteModule({ logger, moduleName, module, old }) {
  const packageName = getPackageName(module, old);
  const modulePath = computeModulePath(packageName, old, moduleName);

  if (fs.existsSync(modulePath)) {
    deleteTemplates();
    removeFromModules();
    if (!old) removeDependency();

    logger.info(chalk.green(`✔ Module ${moduleName} for package ${module} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${moduleName} for package ${module} not found!`));
  }

  /* Delete module steps */

  function deleteTemplates() {
    logger.info(`Deleting ${packageName} files…`);
    // remove module directory
    shell.rm('-rf', modulePath);

    // in new module structure remove root dir if no submodules exist
    if (!old) {
      const rootModulePath = computeRootModulesPath(moduleName);
      if (!shell.ls(rootModulePath).length) {
        shell.rm('-rf', rootModulePath);
      }
    }
    logger.info(chalk.green(`✔ The ${packageName} files of the module ${moduleName} have been deleted!`));
  }

  function removeFromModules() {
    // Gets modules entry point file path
    const modulesEntry = getModulesEntryPoint(module, old);

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
        RegExp(`import ${moduleName} from '${computeModulePackageName(moduleName, packageName, old)}';\n`, 'g'),
        ''
      );

    fs.writeFileSync(modulesEntry, contentWithoutDeletedModule);
    runPrettier(modulesEntry);
  }

  function removeDependency() {
    // Get package content
    const packagePath = computePackagePath(module);
    const packageContent = `` + fs.readFileSync(packagePath);

    // Extract dependencies
    const dependenciesRegExp = /"dependencies":\s\{([^()]+)\},\n\s+"devDependencies"/g;
    const [, dependencies] = dependenciesRegExp.exec(packageContent) || ['', ''];

    // Remove package
    const dependenciesWithoutDeleted = dependencies
      .split(',')
      .filter(pkg => !pkg.includes(computeModulePackageName(moduleName, packageName, old)));

    // Remove module from package list
    shell
      .ShellString(
        packageContent.replace(
          RegExp(dependenciesRegExp, 'g'),
          `"dependencies": {${dependenciesWithoutDeleted}},\n  "devDependencies"`
        )
      )
      .to(packagePath);

    removeSymlink(module, packageName);
  }
}

module.exports = deleteModule;
