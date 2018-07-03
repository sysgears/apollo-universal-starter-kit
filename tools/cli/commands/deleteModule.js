const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const { deleteModuleFromGeneratedContainersFile } = require('../helpers/util');

/**
 *
 * @param logger
 * @param templatePath
 * @param module
 * @param location
 */
function deleteModule(logger, templatePath, module, location) {
  logger.info(`Deleting ${location} files…`);

  // pascalize
  const Module = pascalize(module);
  const startPath = `${__dirname}/../../..`;
  const modulePath = `${startPath}/packages/${location}/src/modules/${module}`;
  const generatedContainerFile = 'generatedContainers.js';
  const generatedContainerPath = `${startPath}/packages/${location}/src/modules/common/${generatedContainerFile}`;

  if (fs.existsSync(modulePath)) {
    // remove module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${startPath}/packages/${location}/src/modules/`);

    // get module input data
    const path = `${startPath}/packages/${location}/src/modules/index.js`;
    let data = fs.readFileSync(path);

    // extract Feature modules
    const re = /Feature\(([^()]+)\)/g;
    const match = re.exec(data);
    const modules = match[1].split(',').filter(featureModule => featureModule.trim() !== module);

    // remove import module line
    const lines = data
      .toString()
      .split('\n')
      .filter(line => line.match(`import ${module} from './${module}';`) === null);
    fs.writeFileSync(path, lines.join('\n'));

    // remove module from Feature function
    //shell.sed('-i', re, `Feature(${modules.toString().trim()})`, 'index.js');
    shell
      .ShellString(shell.cat('index.js').replace(RegExp(re, 'g'), `Feature(${modules.toString().trim()})`))
      .to('index.js');

    if (location === 'server') {
      // change to database migrations directory
      shell.cd(`${startPath}/packages/${location}/src/database/migrations`);
      // check if any migrations files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okMigrations = shell.rm(`*_${Module}.js`);
        if (okMigrations) {
          logger.info(chalk.green(`✔ Database migrations files successfully deleted!`));
        }
      }

      // change to database seeds directory
      shell.cd(`${startPath}/packages/${location}/src/database/seeds`);
      // check if any seed files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okSeeds = shell.rm(`*_${Module}.js`);
        if (okSeeds) {
          logger.info(chalk.green(`✔ Database seed files successfully deleted!`));
        }
      }
    }

    // continue only if directory does not jet exist
    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }

  if (fs.existsSync(generatedContainerPath)) {
    const graphqlQuery = `${Module}Query`;
    deleteModuleFromGeneratedContainersFile(module, generatedContainerPath, graphqlQuery);
  }
}

module.exports = deleteModule;
