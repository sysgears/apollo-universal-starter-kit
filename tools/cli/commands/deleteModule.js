const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const deleteMigrations = require('./subCommands/deleteMigrations');
/**
 * Delete module
 * @param logger
 * @param module
 * @param location
 * @param options
 */
function deleteModule(logger, module, location, options) {
  logger.info(`Deleting ${location} files…`);
  const startPath = `${__dirname}/../../..`;
  const modulePath = `${startPath}/packages/${location}/src/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // remove module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${startPath}/packages/${location}/src/modules/`);

    // get index file path
    const modulesPath = `${startPath}/packages/${location}/src/modules/`;
    const indexFullFileName = fs.readdirSync(modulesPath).find(name => name.search(/index/) >= 0);
    const indexPath = modulesPath + indexFullFileName;

    let indexContent;
    try {
      indexContent = fs.readFileSync(indexPath);
    } catch (e) {
      logger.error(chalk.red(`Failed to read /packages/${location}/src/modules/index.js file`));
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

    // delete migration and seed if server location and option -m specified
    if (location === 'server' && options.m) {
      deleteMigrations(logger, module);
    }
    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }
}

module.exports = deleteModule;
