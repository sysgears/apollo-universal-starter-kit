const shell = require('shelljs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const { renameFiles, updateFileWithExports } = require('../helpers/util');
const { addModule } = require('./addModule');

/**
 *
 * @param logger
 * @param templatePath
 * @param module
 * @param tablePrefix
 * @param location
 */
function addCrud(logger, templatePath, module, tablePrefix, location) {
  logger.info(`Copying ${location} files…`);

  const Module = pascalize(module);
  const startPath = `${__dirname}/../../..`;

  addModule(logger, templatePath, module, location, false);

  /*    if (action === 'addcrud' && location === 'client') {
      const generatedContainerFile = 'generatedContainers.js';
      const graphqlQuery = `${Module}Query`;
      const options = {
        pathToFileWithExports: `${startPath}/packages/${location}/src/modules/common/${generatedContainerFile}`,
        exportName: graphqlQuery,
        importString: `import ${graphqlQuery} from '../${module}/containers/${graphqlQuery}';\n`
      };
      updateFileWithExports(options);
    }*/

  if (location === 'server') {
    console.log('copy database files');
    const destinationPath = `${startPath}/packages/${location}/src/database`;
    renameFiles(destinationPath, templatePath, module, 'database');

    const timestamp = new Date().getTime();
    shell.cd(`${startPath}/packages/${location}/src/database/migrations`);
    shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);
    shell.cd(`${startPath}/packages/${location}/src/database/seeds`);
    shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);

    logger.info(chalk.green(`✔ The database files have been copied!`));

    if (tablePrefix !== '') {
      shell.cd(`${startPath}/packages/${location}/src/modules/${module}`);
      shell.sed('-i', /this.prefix = '';/g, `this.prefix = '${tablePrefix}';`, 'sql.js');

      logger.info(chalk.green(`✔ Inserted db table prefix!`));
    }

    const generatedSchemasFile = 'generatedSchemas.js';
    const schema = `${Module}Schema`;
    const options = {
      pathToFileWithExports: `${startPath}/packages/${location}/src/modules/common/${generatedSchemasFile}`,
      exportName: schema,
      importString: `import { ${schema} } from '../${module}/schema';\n`
    };
    updateFileWithExports(options);
  }

  logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
}

module.exports = addCrud;
