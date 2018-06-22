const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const { renameFiles, generateCommonGraphqlFile } = require('../helpers/util');

/**
 *
 * @param logger
 * @param templatePath
 * @param module
 * @param action
 * @param tablePrefix
 * @param location
 */
function addModule(logger, templatePath, module, action, tablePrefix, location) {
  logger.info(`Copying ${location} files…`);

  // pascalize
  const Module = pascalize(module);

  // create new module directory
  const startPath = `${__dirname}/../../..`;
  const mkdir = shell.mkdir(`${startPath}/packages/${location}/src/modules/${module}`);

  // continue only if directory does not jet exist
  if (mkdir.code === 0) {
    const destinationPath = `${startPath}/packages/${location}/src/modules/${module}`;
    renameFiles(destinationPath, templatePath, module, location);

    logger.info(chalk.green(`✔ The ${location} files have been copied!`));

    shell.cd('..');
    // get module input data
    const path = `${startPath}/packages/${location}/src/modules/index.js`;
    let data = fs.readFileSync(path);

    // extract Feature modules
    const re = /Feature\(([^()]+)\)/g;
    const match = re.exec(data);

    // prepend import module
    const prepend = `import ${module} from './${module}';\n`;
    fs.writeFileSync(path, prepend + data);

    // add module to Feature function
    shell.ShellString(shell.cat('index.js').replace(RegExp(re, 'g'), `Feature(${module}, ${match[1]})`)).to('index.js');

    if (action === 'addcrud' && location === 'client') {
      const commonGraphqlFile = 'commonGraphql.js';
      const commonGraphqlPath = `${startPath}/packages/${location}/src/modules/common/components/web/${commonGraphqlFile}`;
      const graphqlQuery = `${Module}Query`;
      generateCommonGraphqlFile(module, commonGraphqlPath, graphqlQuery);
    }

    if (action === 'addcrud' && location === 'server') {
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
    }

    logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
  }
}

module.exports = addModule;
