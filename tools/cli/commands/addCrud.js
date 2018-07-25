const shell = require('shelljs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const { copyFiles, renameFiles } = require('../helpers/util');
const addModule = require('./addModule');

/**
 * Add CRUD module command
 * @param logger
 * @param templatePath
 * @param module
 * @param tablePrefix
 * @param location
 */
function addCrud(logger, templatePath, module, tablePrefix, location) {
  addModule(logger, templatePath, module, location, false);

  if (location === 'server') {
    const Module = pascalize(module);
    const startPath = `${__dirname}/../../..`;
    const databasePath = `${startPath}/packages/${location}/src/database`;
    logger.info('Copying database files...');

    //copy and rename templates in destination directory
    copyFiles(databasePath, templatePath, 'database');
    renameFiles(databasePath, module);
    const timestamp = new Date().getTime();
    // rename migrations and seeds
    shell.cd(`${startPath}/packages/${location}/src/database/migrations`);
    shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);
    shell.cd(`${startPath}/packages/${location}/src/database/seeds`);
    shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);

    logger.info(chalk.green(`✔ The database files have been copied!`));

    if (tablePrefix) {
      shell.cd(`${startPath}/packages/${location}/src/modules/${module}`);
      shell.sed('-i', /tablePrefix: ''/g, `tablePrefix: '${tablePrefix}'`, 'schema.js');

      logger.info(chalk.green(`✔ Inserted db table prefix!`));
    }
  }

  logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
}

module.exports = addCrud;
