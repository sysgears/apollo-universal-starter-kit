const shell = require('shelljs');
const chalk = require('chalk');
const addModule = require('./addModule');
const addMigration = require('./subCommands/addMigration');
const { computeModulesPath } = require('../helpers/util');

/**
 * Add CRUD module command
 * @param logger
 * @param templatesPath
 * @param module
 * @param tablePrefix
 * @param location
 */
function addCrud(logger, templatesPath, module, tablePrefix, location) {
  // add module in server, client
  addModule(logger, templatesPath, module, location, false);

  if (location === 'server') {
    // add module migration and seed
    addMigration(logger, templatesPath, module);

    if (tablePrefix) {
      shell.cd(computeModulesPath(location, module));
      shell.sed('-i', /tablePrefix: ''/g, `tablePrefix: '${tablePrefix}'`, 'schema.js');

      logger.info(chalk.green(`✔ Inserted db table prefix!`));
    }
  }

  logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
}

module.exports = addCrud;
