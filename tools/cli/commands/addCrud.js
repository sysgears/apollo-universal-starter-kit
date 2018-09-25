const shell = require('shelljs');
const chalk = require('chalk');
const addModule = require('./addModule');
const addMigration = require('./subCommands/addMigration');
const { computeModulesPath } = require('../helpers/util');

/**
 * Adds CRUD module in server and adds a new module to the Feature connector.
 *
 * @param logger - The Logger.
 * @param templatesPath - The path to the templates for a new module.
 * @param moduleName - The name of a new module.
 * @param tablePrefix
 * @param location - The location for a new module [client|server|both].
 */
function addCrud(logger, templatesPath, moduleName, tablePrefix, location) {
  // add module in server, client
  addModule(logger, templatesPath, moduleName, location, false);

  if (location === 'server') {
    // add migration and seed for new module
    addMigration(logger, templatesPath, moduleName);

    if (tablePrefix) {
      shell.cd(computeModulesPath(location, moduleName));
      shell.sed('-i', /tablePrefix: ''/g, `tablePrefix: '${tablePrefix}'`, 'schema.js');

      logger.info(chalk.green(`✔ Inserted db table prefix!`));
    }
  }

  logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
}

module.exports = addCrud;
