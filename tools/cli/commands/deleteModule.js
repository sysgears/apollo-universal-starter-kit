const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const {
  computeModulesPath,
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
 * @param options - User defined options
 * @param location - The location for a new module [client|server|both].
 */
function deleteModule(logger, moduleName, options, location) {
  logger.info(`Deleting ${location} files…`);
  const modulePath = computeModulesPath(location, options, moduleName);

  if (fs.existsSync(modulePath)) {
    // remove module directory
    shell.rm('-rf', modulePath);

    // in new module structure remove root dir if no submodules exist
    if (!options.old) {
      const rootModulePath = computeRootModulesPath(moduleName);
      if (shell.ls(rootModulePath).length === 0) {
        shell.rm('-rf', rootModulePath);
      }
    }
    const modulesPath = computeModulesPath(location, options);

    // get index file path
    const indexFullFileName = fs.readdirSync(modulesPath).find(name => name.search(/index/) >= 0);
    const indexPath = modulesPath + indexFullFileName;
    let indexContent;

    try {
      indexContent = fs.readFileSync(indexPath);
    } catch (e) {
      logger.error(chalk.red(`Failed to read ${indexPath} file`));
      process.exit();
    }

    // extract application modules
    const appModuleRegExp = /Module\(([^()]+)\)/g;
    const [, appModules] = appModuleRegExp.exec(indexContent) || ['', ''];
    const appModulesWithoutDeleted = appModules.split(',').filter(appModule => appModule.trim() !== moduleName);

    const contentWithoutDeletedModule = indexContent
      .toString()
      // remove module from modules list
      .replace(appModuleRegExp, `Module(${appModulesWithoutDeleted.toString().trim()})`)
      // remove module import
      .replace(
        RegExp(`import ${moduleName} from '${computeModulePackageName(location, options, moduleName)}';\n`, 'g'),
        ''
      );

    fs.writeFileSync(indexPath, contentWithoutDeletedModule);
    runPrettier(indexPath);

    if (!options.old) {
      // get package content
      const packagePath = computePackagePath(location);
      const packageContent = `` + fs.readFileSync(packagePath);

      // extract dependencies
      const dependenciesRegExp = /"dependencies":\s\{([^()]+)\},\n\s+"devDependencies"/g;
      const [, dependencies] = dependenciesRegExp.exec(packageContent) || ['', ''];
      const dependenciesWithoutDeleted = dependencies
        .split(',')
        .filter(pkg => pkg.indexOf(computeModulePackageName(location, options, moduleName)) < 0);

      // remove module from package list
      shell
        .ShellString(
          packageContent.replace(
            RegExp(dependenciesRegExp, 'g'),
            `"dependencies": {${dependenciesWithoutDeleted}},\n  "devDependencies"`
          )
        )
        .to(packagePath);

      removeSymlink(location, moduleName);
    }

    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }
}

module.exports = deleteModule;
