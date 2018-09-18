const shell = require('shelljs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const addModule = require('./addModule');
const addMigration = require('./subCommands/addMigration');
const { computeModulesPath, updateFileWithExports } = require('../helpers/util');
const { BASE_PATH } = require('../config');

/**
 * Adds CRUD module in client or server and adds a new module to the Feature connector.
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

  // pascalize
  const Module = pascalize(moduleName);

  if (location === 'client') {
    const generatedContainerFile = 'generatedContainers.js';
    const graphqlQuery = `${Module}Query`;
    const options = {
      pathToFileWithExports: `${BASE_PATH}/packages/${location}/src/modules/common/${generatedContainerFile}`,
      exportName: graphqlQuery,
      importString: `import ${graphqlQuery} from '../${moduleName}/containers/${graphqlQuery}';\n`
    };
    updateFileWithExports(options);
  }

  if (location === 'server') {
    // add migration and seed for new module
    addMigration(logger, templatesPath, moduleName);

    if (tablePrefix) {
      shell.cd(computeModulesPath(location, moduleName));
      shell.sed('-i', /tablePrefix: ''/g, `tablePrefix: '${tablePrefix}'`, 'schema.js');

      logger.info(chalk.green(`✔ Inserted db table prefix!`));
    }

    const generatedSchemasFile = 'generatedSchemas.js';
    const schema = `${Module}Schema`;
    const options = {
      pathToFileWithExports: `${BASE_PATH}/packages/${location}/src/modules/common/${generatedSchemasFile}`,
      exportName: schema,
      importString: `import { ${schema} } from '../${moduleName}/schema';\n`
    };
    updateFileWithExports(options);
  }

  logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
}

module.exports = addCrud;
