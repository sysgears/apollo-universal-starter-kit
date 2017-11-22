/* eslint-disable import/no-dynamic-require */
require('babel-register')({ presets: ['env'], plugins: ['transform-class-properties'] });
require('babel-polyfill');

const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');

String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function renameFiles(destinationPath, templatePath, module, location) {
  shell.cp('-R', `${templatePath}/${location}/*`, destinationPath);

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
      shell.sed('-i', /\$MODULE\$/g, module.toUpperCase(), entry.name);
    }
  });
}

function copyFiles(logger, templatePath, module, action, location) {
  logger.info(`Copying ${location} files…`);

  // create new module directory
  const mkdir = shell.mkdir(`${__dirname}/../../src/${location}/modules/${module}`);

  // continue only if directory does not jet exist
  if (mkdir.code === 0) {
    const destinationPath = `${__dirname}/../../src/${location}/modules/${module}`;
    renameFiles(destinationPath, templatePath, module, location);

    logger.info(chalk.green(`✔ The ${location} files have been copied!`));

    shell.cd('..');
    // get module input data
    const path = `${__dirname}/../../src/${location}/modules/index.js`;
    let data = fs.readFileSync(path);

    // extract Feature modules
    const re = /Feature\(([^()]+)\)/g;
    const match = re.exec(data);

    // prepend import module
    const prepend = `import ${module} from './${module}';\n`;
    fs.writeFileSync(path, prepend + data);

    // add module to Feature function
    shell.sed('-i', re, `Feature(${module}, ${match[1]})`, 'index.js');

    if (action === 'addcrud' && location === 'server') {
      console.log('copy database files');
      const destinationPath = `${__dirname}/../../src/${location}/database`;
      renameFiles(destinationPath, templatePath, module, 'database');

      const timestamp = new Date().getTime();
      shell.cd(`${__dirname}/../../src/${location}/database/migrations`);
      shell.mv(`_${module.toCamelCase().capitalize()}.js`, `${timestamp}_${module.toCamelCase().capitalize()}.js`);
      shell.cd(`${__dirname}/../../src/${location}/database/seeds`);
      shell.mv(`_${module.toCamelCase().capitalize()}.js`, `${timestamp}_${module.toCamelCase().capitalize()}.js`);

      logger.info(chalk.green(`✔ The database files have been copied!`));
    }

    logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
  }
}

function deleteFiles(logger, templatePath, module, location) {
  logger.info(`Deleting ${location} files…`);

  const modulePath = `${__dirname}/../../src/${location}/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // create new module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${__dirname}/../../src/${location}/modules/`);

    // get module input data
    const path = `${__dirname}/../../src/${location}/modules/index.js`;
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
    shell.sed('-i', re, `Feature(${modules.toString().trim()})`, 'index.js');

    if (location === 'server') {
      // change to database migrations directory
      shell.cd(`${__dirname}/../../src/${location}/database/migrations`);
      // check if any migrations files for this module exist
      if (shell.find('.').filter(file => file.search(`_${module.toCamelCase().capitalize()}.js`) > -1).length > 0) {
        let okMigrations = shell.rm(`*_${module.toCamelCase().capitalize()}.js`);
        if (okMigrations) {
          logger.info(chalk.green(`✔ Database migrations files successfully deleted!`));
        }
      }

      // change to database seeds directory
      shell.cd(`${__dirname}/../../src/${location}/database/seeds`);
      // check if any seed files for this module exist
      if (shell.find('.').filter(file => file.search(`_${module.toCamelCase().capitalize()}.js`) > -1).length > 0) {
        let okSeeds = shell.rm(`*_${module.toCamelCase().capitalize()}.js`);
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
}

function updateSchema(logger, module) {
  logger.info(`Updating ${module} Schema…`);

  // get fragment file
  const path = `${__dirname}/../../src/client/modules/${module}/graphql/`;
  if (fs.existsSync(path)) {
    const file = `${module.toCamelCase().capitalize()}.graphql`;
    const re = /\{([^()]+)\}/g;

    // get module schema
    const schema = require(`../../src/server/modules/${module}/schema`);

    // regenerate graphql fragment
    let graphql = '{\n';
    for (const key of Object.keys(schema[module.toCamelCase().capitalize()].values)) {
      graphql += `  ${key}\n`;
    }
    graphql += '}';

    // override graphql fragment file
    shell.cd(path);
    // remove all new lines
    shell.exec(`tr -d '\n' < ${file} > ${file}.tmp`);
    // replace content
    shell.sed('-i', re, graphql, `${file}.tmp`);
    // remove old file
    shell.rm(file);
    // rename tmp file
    shell.mv(`${file}.tmp`, file);

    logger.info(chalk.green(`✔ Fragment in ${path}${file} successfully updated!`));
  } else {
    logger.error(chalk.red(`✘ Path ${path} not found!`));
  }
}

module.exports = (action, args, options, logger) => {
  const module = args.module;
  let location = 'both';
  if (args.location) {
    location = args.location;
  }

  let templatePath = `${__dirname}/../templates/module`;
  if (action === 'addcrud') {
    templatePath = `${__dirname}/../templates/crud`;
  }

  if (!fs.existsSync(templatePath)) {
    logger.error(chalk.red(`The requested location for ${location} not found.`));
    process.exit(1);
  }

  // client
  if (location === 'client' || location === 'both') {
    if (action === 'addmodule' || action === 'addcrud') {
      copyFiles(logger, templatePath, module, action, 'client');
    } else if (action === 'deletemodule') {
      deleteFiles(logger, templatePath, module, 'client');
    }
  }

  // server
  if (location === 'server' || location === 'both') {
    if (action === 'addmodule' || action === 'addcrud') {
      copyFiles(logger, templatePath, module, action, 'server');
    } else if (action === 'deletemodule') {
      deleteFiles(logger, templatePath, module, 'server');
    }
  }

  // update schema
  if (action === 'updateschema') {
    updateSchema(logger, module);
  }
};
