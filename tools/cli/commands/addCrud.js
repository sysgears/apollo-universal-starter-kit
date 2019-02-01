const chalk = require('chalk');
const { pascalize, decamelize } = require('humps');
const addModule = require('./addModule');
const {
  getModulePackageName,
  computeGeneratedSchemasPath,
  updateFileWithExports,
  runPrettier
} = require('../helpers/util');

/**
 * Adds CRUD module in server and adds a new module to the Feature connector.
 *
 * @param logger - The Logger.
 * @param moduleName - The name of a new module.
 * @param tablePrefix
 * @param packageName - The location for a new module [client|server|both].
 */
function addCrud({ logger, packageName, moduleName, old }) {
  console.log('packageName:', packageName);
  console.log('moduleName:', moduleName);
  console.log('old:', old);

  // add module in server, client
  addModule({ logger, packageName, moduleName, old, crud: true });

  // pascalize
  const Module = pascalize(moduleName);
  const modulePackageName = getModulePackageName(packageName, old);

  if (packageName === 'server') {
    const schema = `${Module}Schema`;
    const fileName = 'generatedSchemas.js';
    const options = {
      pathToFileWithExports: computeGeneratedSchemasPath(packageName, fileName, old),
      exportName: schema,
      importString: `import { ${schema} } from '@gqlapp/${decamelize(moduleName, {
        separator: '-'
      })}-${modulePackageName}/schema';\n`
    };
    updateFileWithExports(options);
    runPrettier(options.pathToFileWithExports);
  }

  logger.info(chalk.green(`✔ Module for ${packageName} successfully created!`));
}

module.exports = addCrud;
