const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const readline = require('readline');
const { computeModulesPath, deleteFromFileWithExports } = require('../helpers/util');
const { BASE_PATH } = require('../config');

/**
 * Removes the module from client, server or both locations and removes the module from the Feature connector.
 *
 * @param location - The location for a new module [client|server|both].
 * @param logger - The Logger.
 * @param moduleName - The name of a new module.
 */
async function deleteModule(location, logger, moduleName) {
  logger.info(`Deleting ${location} files…`);

  // pascalize
  const Module = pascalize(moduleName);
  const modulePath = computeModulesPath(location, moduleName);
  const modulesPath = computeModulesPath(location);
  const moduleCommonPath = `${modulesPath}/common`;
  const generatedContainerFile = 'generatedContainers.js';
  const generatedContainerPath = `${moduleCommonPath}/${generatedContainerFile}`;
  const generatedSchemasFile = 'generatedSchemas.js';
  const generatedSchemaPath = `${moduleCommonPath}/${generatedSchemasFile}`;
  let userAnswer;

  if (fs.existsSync(modulePath)) {
    if (location === 'server') {
      // get list of migrations
      const migrationNames = shell.find(`${BASE_PATH}/packages/server/src/database/migrations/`);

      // open server directory
      shell.cd(`${BASE_PATH}/packages/server`);

      const isLastCreated = !!(migrationNames && migrationNames[migrationNames.length - 1].match(`_${Module}.js`));
      const isExecuted = shell.exec('yarn knex-migrate list', { silent: true }).includes(`_${Module}.js`);

      if (isLastCreated && isExecuted) {
        // open server directory
        shell.cd(`${BASE_PATH}/packages/server`);
        // rollback migration
        shell.exec('yarn knex-migrate down');
        logger.info(chalk.green(`✔ Rollback migration was successfully!`));
      } else if (isExecuted) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const askQuestion = () => {
          return new Promise(resolve => {
            rl.question(`The table ${moduleName} won't be deleted. Do you want continue y/n?\n`, answer => {
              rl.close(answer);
              resolve(answer);
            });
          });
        };

        do {
          userAnswer = await askQuestion();
        } while (userAnswer !== 'y' && userAnswer !== 'n');
      }

      if (userAnswer === 'n') {
        return;
      }

      // change to database migrations directory
      shell.cd(`${BASE_PATH}/packages/server/src/database/migrations`);
      // check if any migrations files for this module existed
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okMigrations = shell.rm(`*_${Module}.js`);
        if (okMigrations) {
          logger.info(chalk.green(`✔ Database migrations files successfully deleted!`));
        }
      }

      // change to database seeds directory
      shell.cd(`${BASE_PATH}/packages/server/src/database/seeds`);
      // check if any seed files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okSeeds = shell.rm(`*_${Module}.js`);
        if (okSeeds) {
          logger.info(chalk.green(`✔ Database seed files successfully deleted!`));
        }
      }
    }

    // remove module directory
    shell.rm('-rf', modulePath);

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
      .filter(featureModule => featureModule.trim() !== moduleName);

    const contentWithoutDeletedModule = indexContent
      .toString()
      // replace features modules on features without deleted module
      .replace(featureRegExp, `Feature(${featureModulesWithoutDeleted.toString().trim()})`)
      // remove import module
      .replace(RegExp(`import ${moduleName} from './${moduleName}';\n`, 'g'), '');

    fs.writeFileSync(indexPath, contentWithoutDeletedModule);

    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }

  if (fs.existsSync(generatedContainerPath)) {
    const graphqlQuery = `${Module}Query`;
    deleteFromFileWithExports(generatedContainerPath, graphqlQuery);
  }
  if (fs.existsSync(generatedSchemaPath)) {
    const schema = `${Module}Schema`;
    deleteFromFileWithExports(generatedSchemaPath, schema);
  }
}

module.exports = deleteModule;
