/* eslint-disable import/no-dynamic-require */

import shell from 'shelljs';
import fs from 'fs';
import chalk from 'chalk';
import GraphQLGenerator from 'domain-graphql';
import { pascalize } from 'humps';

String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

function renameFiles(destinationPath, templatePath, module, location) {
  // pascalize
  const Module = pascalize(module);

  shell.cp('-R', `${templatePath}/${location}/*`, destinationPath);

  // change to destination directory
  shell.cd(destinationPath);

  // rename files
  shell.ls('-Rl', '.').forEach(entry => {
    if (entry.isFile()) {
      const moduleFile = entry.name.replace('Module', Module);
      shell.mv(entry.name, moduleFile);
    }
  });

  // replace module names
  shell.ls('-Rl', '.').forEach(entry => {
    if (entry.isFile()) {
      shell.sed('-i', /\$module\$/g, module, entry.name);
      shell.sed('-i', /\$Module\$/g, Module, entry.name);
      shell.sed('-i', /\$MODULE\$/g, module.toUpperCase(), entry.name);
    }
  });
}

function copyFiles(logger, templatePath, module, action, tablePrefix, location) {
  logger.info(`Copying ${location} files…`);

  // pascalize
  const Module = pascalize(module);

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
    shell.ShellString(shell.cat('index.js').replace(RegExp(re, 'g'), `Feature(${module}, ${match[1]})`)).to('index.js');

    if (action === 'addcrud' && location === 'server') {
      console.log('copy database files');
      const destinationPath = `${__dirname}/../../src/${location}/database`;
      renameFiles(destinationPath, templatePath, module, 'database');

      const timestamp = new Date().getTime();
      shell.cd(`${__dirname}/../../src/${location}/database/migrations`);
      shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);
      shell.cd(`${__dirname}/../../src/${location}/database/seeds`);
      shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);

      logger.info(chalk.green(`✔ The database files have been copied!`));

      if (tablePrefix !== '') {
        shell.cd(`${__dirname}/../../src/${location}/modules/${module}`);
        shell.sed('-i', /const prefix = '';/g, `const prefix = '${tablePrefix}';`, 'sql.js');

        logger.info(chalk.green(`✔ Inserted db table prefix!`));
      }
    }

    logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
  }
}

function deleteFiles(logger, templatePath, module, location) {
  logger.info(`Deleting ${location} files…`);

  // pascalize
  const Module = pascalize(module);

  const modulePath = `${__dirname}/../../src/${location}/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // remove module directory
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
    //shell.sed('-i', re, `Feature(${modules.toString().trim()})`, 'index.js');
    shell
      .ShellString(shell.cat('index.js').replace(RegExp(re, 'g'), `Feature(${modules.toString().trim()})`))
      .to('index.js');

    if (location === 'server') {
      // change to database migrations directory
      shell.cd(`${__dirname}/../../src/${location}/database/migrations`);
      // check if any migrations files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okMigrations = shell.rm(`*_${Module}.js`);
        if (okMigrations) {
          logger.info(chalk.green(`✔ Database migrations files successfully deleted!`));
        }
      }

      // change to database seeds directory
      shell.cd(`${__dirname}/../../src/${location}/database/seeds`);
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
}

function updateSchema(logger, module) {
  logger.info(`Updating ${module} Schema…`);

  // pascalize
  const Module = pascalize(module);

  const modulePath = `${__dirname}/../../src/server/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // get module schema
    const schema = require(`${modulePath}/schema`)[Module];

    // get schema file
    const pathSchema = `${__dirname}/../../src/server/modules/${module}/`;
    if (fs.existsSync(pathSchema)) {
      const file = `schema.graphql`;

      // regenerate input fields
      let inputAdd = '';
      let inputEdit = '';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        if (!value.type.isSchema && value.type.constructor !== Array) {
          if (key !== 'id') {
            inputAdd += `  ${key}: ` + new GraphQLGenerator()._generateField(schema.name, value, key) + '\n';
          }
          inputEdit += `  ${key}: ` + new GraphQLGenerator()._generateField(schema.name + '.' + key, value, []) + '\n';
        }
      }

      shell.cd(pathSchema);
      // override Module type in schema.graphql file
      const replaceType = `### schema type definitions([^()]+)### end schema type definitions`;
      shell
        .ShellString(
          shell
            .cat(file)
            .replace(
              RegExp(replaceType, 'g'),
              `### schema type definitions\n${new GraphQLGenerator().generateTypes(
                schema
              )}\n\n### end schema type definitions`
            )
        )
        .to(file);

      // override AddModuleInput in schema.graphql file
      const replaceAdd = `input Add${Module}Input {([^}])*\\n}`;
      shell
        .ShellString(shell.cat(file).replace(RegExp(replaceAdd, 'g'), `input Add${Module}Input {\n${inputAdd}}`))
        .to(file);

      // override EditmoduleInput in schema.graphql file
      const replaceEdit = `input Edit${Module}Input {([^}])*\\n}`;
      shell
        .ShellString(shell.cat(file).replace(RegExp(replaceEdit, 'g'), `input Edit${Module}Input {\n${inputEdit}}`))
        .to(file);

      logger.info(chalk.green(`✔ Schema in ${pathSchema}${file} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ Schema path ${pathSchema} not found!`));
    }

    // get fragment file
    const pathFragment = `${__dirname}/../../src/client/modules/${module}/graphql/`;
    if (fs.existsSync(pathFragment)) {
      const file = `${Module}.graphql`;

      // regenerate graphql fragment
      let graphql = '';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        if (!value.type.isSchema && value.type.constructor !== Array) {
          graphql += `  ${key}\n`;
        }
      }

      shell.cd(pathFragment);
      // override graphql fragment file
      const replaceFragment = `${Module} {(.|\n)*\n}`;
      shell.ShellString(shell.cat(file).replace(RegExp(replaceFragment, 'g'), `${Module} {\n${graphql}}`)).to(file);

      logger.info(chalk.green(`✔ Fragment in ${pathFragment}${file} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ Fragment path ${pathFragment} not found!`));
    }
  } else {
    logger.info(chalk.red(`✘ Module ${module} in path ${modulePath} not found!`));
  }
}

module.exports = (action, args, options, logger) => {
  const module = args.module;
  let location = 'both';
  if (args.location) {
    location = args.location;
  }
  let tablePrefix = '';
  if (args.tablePrefix) {
    tablePrefix = args.tablePrefix;
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
      copyFiles(logger, templatePath, module, action, tablePrefix, 'client');
    } else if (action === 'deletemodule') {
      deleteFiles(logger, templatePath, module, 'client');
    }
  }

  // server
  if (location === 'server' || location === 'both') {
    if (action === 'addmodule' || action === 'addcrud') {
      copyFiles(logger, templatePath, module, action, tablePrefix, 'server');
    } else if (action === 'deletemodule') {
      deleteFiles(logger, templatePath, module, 'server');
    }
  }

  // update schema
  if (action === 'updateschema') {
    updateSchema(logger, module);
  }
};
