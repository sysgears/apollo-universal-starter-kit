const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { computeModulesPath } = require('../helpers/util');

/**
 * Delete module
 * @param logger
 * @param module
 * @param options
 * @param location
 */
function deleteModule(logger, module, options, location) {
  logger.info(`Deleting ${location} files…`);
  const modulePath = computeModulesPath(location, module);

  if (fs.existsSync(modulePath)) {
    // remove module directory
    shell.rm('-rf', modulePath);

    const modulesPath = computeModulesPath(location);

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

    // extract Feature modules
    const featureRegExp = /Feature\(([^()]+)\)/g;
    const [, featureModules] = featureRegExp.exec(indexContent) || ['', ''];
    const featureModulesWithoutDeleted = featureModules
      .split(',')
      .filter(featureModule => featureModule.trim() !== module);

    const contentWithoutDeletedModule = indexContent
      .toString()
      // replace features modules on features without deleted module
      .replace(featureRegExp, `Feature(${featureModulesWithoutDeleted.toString().trim()})`)
      // remove import module
      .replace(RegExp(`import ${module} from './${module}';\n`, 'g'), '');

    fs.writeFileSync(indexPath, contentWithoutDeletedModule);

    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }
}

module.exports = deleteModule;
