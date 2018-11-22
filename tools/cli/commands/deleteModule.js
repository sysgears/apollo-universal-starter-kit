const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { computeModulesPath, runPrettier } = require('../helpers/util');

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

    const importFrom = options.old ? `./${moduleName}` : `@module/${moduleName}-${location}`;
    const contentWithoutDeletedModule = indexContent
      .toString()
      // remove module from modules list
      .replace(appModuleRegExp, `Module(${appModulesWithoutDeleted.toString().trim()})`)
      // remove module import
      .replace(RegExp(`import ${moduleName} from '${importFrom}';\n`, 'g'), '');

    fs.writeFileSync(indexPath, contentWithoutDeletedModule);
    runPrettier(indexPath);

    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }
}

module.exports = deleteModule;
