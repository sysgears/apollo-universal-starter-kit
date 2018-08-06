const shell = require('shelljs');
const fs = require('fs');

String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function copyFiles(logger, templatePath, module, location) {
  logger.info(`Copying ${location} files…`);

  // create new module directory
  const mkdir = shell.mkdir(`${__dirname}/../../packages/${location}/src/modules/${module}`);

  // continue only if directory does not jet exist
  if (mkdir.code === 0) {
    const destinationPath = `${__dirname}/../../packages/${location}/src/modules/${module}`;
    shell.cp('-R', `${templatePath}/${location}/*`, destinationPath);

    logger.info(`✔ The ${location} files have been copied!`);

    // change to destination directory
    shell.cd(destinationPath);

    // rename files
    shell.ls('-Rl', '.').forEach(entry => {
      if (entry.isFile()) {
        const moduleFile = entry.name.replace('Module', module.capitalize());
        shell.mv(entry.name, moduleFile);
      }
    });

    // replace module names
    shell.ls('-Rl', '.').forEach(entry => {
      if (entry.isFile()) {
        shell.sed('-i', /\$module\$/g, module, entry.name);
        shell.sed('-i', /\$Module\$/g, module.toCamelCase().capitalize(), entry.name);
      }
    });

    // get index file path
    const modulesPath = `${__dirname}/../../packages/${location}/src/modules/`;
    const indexFullFileName = fs.readdirSync(modulesPath).find(name => name.search(/index/) >= 0);
    const indexPath = modulesPath + indexFullFileName;
    let indexContent;

    try {
      // prepend import module
      indexContent = `import ${module} from './${module}';\n` + fs.readFileSync(indexPath);
    } catch (e) {
      logger.error(`Failed to read ${indexPath} file`);
      process.exit();
    }

    // extract Feature modules
    const featureRegExp = /Feature\(([^()]+)\)/g;
    const [, featureModules] = featureRegExp.exec(indexContent) || ['', ''];

    // add module to Feature connector
    shell
      .ShellString(indexContent.replace(RegExp(featureRegExp, 'g'), `Feature(${module}, ${featureModules})`))
      .to(indexPath);

    logger.info(`✔ Module for ${location} successfully created!`);
  }
}

function deleteFiles(logger, templatePath, module, location) {
  logger.info(`Deleting ${location} files…`);

  const modulePath = `${__dirname}/../../packages/${location}/src/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // delete module directory
    shell.rm('-rf', modulePath);

    // path to modules index file
    const modulesPath = `${__dirname}/../../packages/${location}/src/modules/`;

    // get index file path
    const indexFullFileName = fs.readdirSync(modulesPath).find(name => name.search(/index/) >= 0);
    const indexPath = modulesPath + indexFullFileName;
    let indexContent;

    try {
      indexContent = fs.readFileSync(indexPath);
    } catch (e) {
      logger.error(`Failed to read ${indexPath} file`);
      process.exit();
    }

    // extract Feature modules
    const featureRegExp = /Feature\(([^()]+)\)/g;
    const [, featureModules] = featureRegExp.exec(indexContent) || ['', ''];
    const featureModulesWithoutDeleted = featureModules
      .split(',')
      .filter(featureModule => featureModule.trim() !== module);

    const contentWithoutDeletedModule = indexContent
      .toString()
      // replace features modules on features without deleted module
      .replace(featureRegExp, `Feature(${featureModulesWithoutDeleted.toString().trim()})`)
      // remove import module
      .replace(RegExp(`import ${module} from './${module}';\n`, 'g'), '');

    fs.writeFileSync(indexPath, contentWithoutDeletedModule);

    logger.info(`✔ Module for ${location} successfully deleted!`);
  } else {
    logger.info(`✔ Module ${location} location for ${modulePath} wasn't found!`);
  }
}

module.exports = (action, args, options, logger) => {
  const templatePath = `${__dirname}/../templates/module`;

  if (!fs.existsSync(templatePath)) {
    logger.error(`The requested location for ${args.location} wasn't found.`);
    process.exit(1);
  }

  // client
  if (args.location === 'client' || args.location === 'both') {
    if (action === 'addmodule') {
      copyFiles(logger, templatePath, args.module, 'client');
    } else if (action === 'deletemodule') {
      deleteFiles(logger, templatePath, args.module, 'client');
    }
  }

  // server
  if (args.location === 'server' || args.location === 'both') {
    if (action === 'addmodule') {
      copyFiles(logger, templatePath, args.module, 'server');
    } else if (action === 'deletemodule') {
      deleteFiles(logger, templatePath, args.module, 'server');
    }
  }
};
