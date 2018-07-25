const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { copyFiles, renameFiles } = require('../helpers/util');

/**
 * Add module in client or server and add new module to the Feature connector
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
  const modulePath = `${startPath}/packages/${location}/src/modules/${module}`;
  const newModule = shell.mkdir(modulePath);

  // continue only if directory does not jet exist
  if (newModule.code !== 0) {
    logger.error(chalk.red(`The ${module} directory is already exists.`));
    process.exit();
  }
  //copy and rename templates in destination directory
  copyFiles(modulePath, templatePath, 'database');
  renameFiles(modulePath, module);

  logger.info(chalk.green(`✔ The ${location} files have been copied!`));

  // get modules index data
  const indexPath = `${startPath}/packages/${location}/src/modules/index.js`;
  let indexContent;
  try {
    // prepend import module
    indexContent = `import ${module} from './${module}';\n` + fs.readFileSync(indexPath);
  } catch (e) {
    logger.error(chalk.red(`Failed to read /packages/${location}/src/modules/index.js file`));
    process.exit();
  }

  // extract Feature modules
  const featureRegExp = /Feature\(([^()]+)\)/g;
  const [, features] = featureRegExp.exec(indexContent) || ['', ''];

  // add module to Feature connector
  shell.ShellString(indexContent.replace(RegExp(featureRegExp, 'g'), `Feature(${module}, ${features})`)).to(indexPath);

  if (finished) {
    logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
  }
}

module.exports = addModule;
