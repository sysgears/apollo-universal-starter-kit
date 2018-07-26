const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { pascalize } = require('humps');
/**
 *
 * @param logger
 * @param module
 * @param location
 */
function deleteModule(logger, module, location) {
  logger.info(`Deleting ${location} files…`);

  const Module = pascalize(module);
  const startPath = `${__dirname}/../../..`;
  const modulePath = `${startPath}/packages/${location}/src/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // remove module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${startPath}/packages/${location}/src/modules/`);

    // get modules index data
    const indexPath = `${startPath}/packages/${location}/src/modules/index.js`;
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

    if (location === 'server') {
      // change to database migrations directory
      shell.cd(`${startPath}/packages/${location}/src/database/migrations`);
      // check if any migrations files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okMigrations = shell.rm(`*_${Module}.js`);
        if (okMigrations) {
          logger.info(chalk.green(`✔ Database migrations files successfully deleted!`));
        }
      }

      // change to database seeds directory
      shell.cd(`${startPath}/packages/${location}/src/database/seeds`);
      // check if any seed files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okSeeds = shell.rm(`*_${Module}.js`);
        if (okSeeds) {
          logger.info(chalk.green(`✔ Database seed files successfully deleted!`));
        }
      }
    }

    // continue only if directory does not jet exist
    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }
}

module.exports = deleteModule;
