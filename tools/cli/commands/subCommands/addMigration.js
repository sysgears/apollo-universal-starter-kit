const shell = require('shelljs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const { copyFiles, renameFiles } = require('../../helpers/util');
const { DATABASE_DIR, MIGRATIONS_DIR, SEEDS_DIR } = require('../../config');

/**
 * Create migration and seed for module
 * @param logger
 * @param module
 * @param templatesPath
 */
function addMigration(logger, templatesPath, module) {
  const Module = pascalize(module);
  logger.info('Copying database files...');

  //copy and rename templates in destination directory
  copyFiles(DATABASE_DIR, templatesPath, 'database');
  renameFiles(DATABASE_DIR, module);
  const timestamp = new Date().getTime();
  // rename migrations and seeds
  shell.cd(MIGRATIONS_DIR);
  shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);
  shell.cd(SEEDS_DIR);
  shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);

  logger.info(chalk.green(`✔ The database files have been copied!`));
}

module.exports = addMigration;
