const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { renameFiles } = require('../helpers/util');

/**
 * +
 * @param logger
 * @param templatePath
 * @param module
 * @param location
 * @param finished
 */
function addModule(logger, templatePath, module, location, finished = true) {
  logger.info(`Copying ${location} files…`);

  // create new module directory
  const startPath = `${__dirname}/../../..`;
  const newModule = shell.mkdir(`${startPath}/packages/${location}/src/modules/${module}`);

  // continue only if directory does not jet exist
  if (newModule.code !== 0) {
    logger.error(chalk.red(`The ${module} directory is already exists.`));
    process.exit(1);
  }
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

  if (finished) {
    logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
  }
}

module.exports = addModule;
