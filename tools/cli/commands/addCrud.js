const shell = require('shelljs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const { copyFiles, renameFiles, updateFileWithExports } = require('../helpers/util');
const { BASE_PATH } = require('../config');

/**
 * Adds module in client or server and adds a new module to the Feature connector.
 *
 * @param location - The location for a new module [client|server|both].
 * @param logger - The Logger.
 * @param templatesPath - The path to the templates for a new module.
 * @param moduleName - The name of a new module.
 * @param finished - The flag about the end of the generating process.
 */
function addCrud(location, logger, templatesPath, moduleName, tablePrefix, finished = true) {
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
    logger.info('Copying database files…');
    const destinationPath = `${BASE_PATH}/packages/${location}/src/database`;
    copyFiles(destinationPath, templatesPath, 'database');
    renameFiles(destinationPath, moduleName);

    const timestamp = new Date().getTime();
    shell.cd(`${BASE_PATH}/packages/${location}/src/database/migrations`);
    shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);
    shell.cd(`${BASE_PATH}/packages/${location}/src/database/seeds`);
    shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);

    logger.info(chalk.green(`✔ The database files have been copied!`));

    if (tablePrefix !== '') {
      shell.cd(`${BASE_PATH}/packages/${location}/src/modules/${moduleName}`);
      shell.sed('-i', /this.prefix = '';/g, `this.prefix = '${tablePrefix}';`, 'sql.js');

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

  if (finished) {
    logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
  }
}

module.exports = addCrud;
