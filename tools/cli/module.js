const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const DomainSchema = require('@domain-schema/core').default;
const GraphQLGenerator = require('@domain-schema/graphql').default;
const { pascalize, camelize, decamelize } = require('humps');
const { startCase } = require('lodash');

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
      shell.sed('-i', /\$_module\$/g, decamelize(module), entry.name);
      shell.sed('-i', /\$Module\$/g, Module, entry.name);
      shell.sed('-i', /\$MoDuLe\$/g, startCase(Module), entry.name);
      shell.sed('-i', /\$MODULE\$/g, module.toUpperCase(), entry.name);
    }
  });
}

function generateField(value, update = false) {
  let result = '';
  const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
  if (hasTypeOf(Boolean)) {
    result += 'Boolean';
  } else if (hasTypeOf(DomainSchema.ID)) {
    result += 'ID';
  } else if (hasTypeOf(DomainSchema.Int)) {
    result += 'Int';
  } else if (hasTypeOf(DomainSchema.Float)) {
    result += 'Float';
  } else if (hasTypeOf(String)) {
    result += 'String';
  } else if (hasTypeOf(Date)) {
    result += 'Date';
  } else if (hasTypeOf(DomainSchema.DateTime)) {
    result += 'DateTime';
  } else if (hasTypeOf(DomainSchema.Time)) {
    result += 'Time';
  }

  if (!update && !value.optional) {
    result += '!';
  }

  return result;
}

function copyFiles(logger, templatePath, module, action, tablePrefix, location) {
  logger.info(`Copying ${location} files…`);

  // pascalize
  const Module = pascalize(module);

  // create new module directory
  const mkdir = shell.mkdir(`${__dirname}/../../packages/${location}/src/modules/${module}`);

  // continue only if directory does not jet exist
  if (mkdir.code === 0) {
    const destinationPath = `${__dirname}/../../packages/${location}/src/modules/${module}`;
    renameFiles(destinationPath, templatePath, module, location);

    logger.info(chalk.green(`✔ The ${location} files have been copied!`));

    shell.cd('..');
    // get module input data
    const path = `${__dirname}/../../packages/${location}/src/modules/index.js`;
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
      const destinationPath = `${__dirname}/../../packages/${location}/src/database`;
      renameFiles(destinationPath, templatePath, module, 'database');

      const timestamp = new Date().getTime();
      shell.cd(`${__dirname}/../../packages/${location}/src/database/migrations`);
      shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);
      shell.cd(`${__dirname}/../../packages/${location}/src/database/seeds`);
      shell.mv(`_${Module}.js`, `${timestamp}_${Module}.js`);

      logger.info(chalk.green(`✔ The database files have been copied!`));

      if (tablePrefix !== '') {
        shell.cd(`${__dirname}/../../packages/${location}/src/modules/${module}`);
        shell.sed('-i', /this.prefix = '';/g, `this.prefix = '${tablePrefix}';`, 'sql.js');

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

  const modulePath = `${__dirname}/../../packages/${location}/src/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // remove module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${__dirname}/../../packages/${location}/src/modules/`);

    // get module input data
    const path = `${__dirname}/../../packages/${location}/src/modules/index.js`;
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
      shell.cd(`${__dirname}/../../packages/${location}/src/database/migrations`);
      // check if any migrations files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okMigrations = shell.rm(`*_${Module}.js`);
        if (okMigrations) {
          logger.info(chalk.green(`✔ Database migrations files successfully deleted!`));
        }
      }

      // change to database seeds directory
      shell.cd(`${__dirname}/../../packages/${location}/src/database/seeds`);
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

  const modulePath = `${__dirname}/../../packages/server/src/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // get module schema
    // eslint-disable-next-line import/no-dynamic-require
    const schema = require(`${modulePath}/schema`)[`${Module}Schema`];

    // get schema file
    const pathSchema = `${__dirname}/../../packages/server/src/modules/${module}/`;
    if (fs.existsSync(pathSchema)) {
      const file = `schema.graphql`;

      // regenerate input fields
      //let moduleData = `  node: ${Module}\n`;
      let inputCreate = '';
      let inputUpdate = '';
      let inputFilter = `  searchText: String\n`;
      let manyInput = '';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
        if (value.type.isSchema) {
          let required = value.optional ? '' : '!';
          inputCreate += `  ${key}Id: Int${required}\n`;
          inputUpdate += `  ${key}Id: Int\n`;
          inputFilter += `  ${key}Id: Int\n`;
          //moduleData += `  ${key}s(limit: Int, orderBy: OrderByInput): [${value.type.name}]\n`;
        } else if (value.type.constructor !== Array) {
          if (key !== 'id') {
            inputCreate += `  ${key}: ${generateField(value)}\n`;
            inputUpdate += `  ${key}: ${generateField(value, true)}\n`;
          }

          if (hasTypeOf(Date)) {
            inputFilter += `  ${key}_lte: ${generateField(value, true)}\n`;
            inputFilter += `  ${key}_gte: ${generateField(value, true)}\n`;
          } else {
            inputFilter += `  ${key}: ${generateField(value, true)}\n`;
          }
        } else if (value.type.constructor === Array && value.type[0].isSchema) {
          inputCreate += `  ${key}: ${pascalize(key)}CreateManyInput\n`;
          inputUpdate += `  ${key}: ${pascalize(key)}UpdateManyInput\n`;

          /*for (const remoteKey of value.type[0].keys()) {
            const remoteValue = value.type[0].values[remoteKey];
            if (remoteValue.type.isSchema) {
              moduleData += `  ${remoteKey}s: [${pascalize(remoteKey)}]\n`;
            }
          }*/

          manyInput += `

input ${pascalize(key)}CreateManyInput {
  create: [${pascalize(value.type[0].name)}CreateInput!]
}

input ${pascalize(key)}UpdateManyInput {
  create: [${pascalize(value.type[0].name)}CreateInput!]
  delete: [${pascalize(value.type[0].name)}WhereUniqueInput!]
  update: [${pascalize(value.type[0].name)}UpdateWhereInput!]
}

input ${pascalize(value.type[0].name)}UpdateWhereInput {
  where: ${pascalize(value.type[0].name)}WhereUniqueInput!
  data: ${pascalize(value.type[0].name)}UpdateInput!
}`;
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
              )}${manyInput}\n\n### end schema type definitions`
            )
        )
        .to(file);

      // override ModuleData in schema.graphql file
      /*let replaceModuleData = `type ${Module}Data {([^}])*\\n}`;
      shell
        .ShellString(shell.cat(file).replace(RegExp(replaceModuleData, 'g'), `type ${Module}Data {\n${moduleData}}`))
        .to(file);*/

      // override ModuleCreateInput in schema.graphql file
      const replaceCreate = `input ${Module}CreateInput {([^}])*\\n}`;
      shell
        .ShellString(
          shell.cat(file).replace(RegExp(replaceCreate, 'g'), `input ${Module}CreateInput {\n${inputCreate}}`)
        )
        .to(file);

      // override ModuleUpdateInput in schema.graphql file
      const replaceUpdate = `input ${Module}UpdateInput {([^}])*\\n}`;
      shell
        .ShellString(
          shell.cat(file).replace(RegExp(replaceUpdate, 'g'), `input ${Module}UpdateInput {\n${inputUpdate}}`)
        )
        .to(file);

      // override ModuleFilterInput in schema.graphql file
      const replaceFilter = `input ${Module}FilterInput {([^}])*\\n}`;
      shell
        .ShellString(
          shell.cat(file).replace(RegExp(replaceFilter, 'g'), `input ${Module}FilterInput {\n${inputFilter}}`)
        )
        .to(file);

      logger.info(chalk.green(`✔ Schema in ${pathSchema}${file} successfully updated!`));

      const resolverFile = `resolvers.js`;
      let replace = `  ${schema.name}: {
`;
      //moduleData = '';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        if (value.type.isSchema) {
          /*moduleData += `    ${key}s(obj, args, ctx, info) {
      return ctx.${value.type.name}.getList(args, info);
    },
`;*/
        } else if (value.type.constructor === Array) {
          replace += `    ${key}: createBatchResolver((sources, args, ctx, info) => {
      return ctx.${schema.name}.getByIds(sources.map(({ id }) => id), '${camelize(schema.name)}', ctx.${
            value.type[0].name
          }, info);
    }),
`;
          /*
          for (const remoteKey of value.type[0].keys()) {
            const remoteValue = value.type[0].values[remoteKey];
            if (remoteValue.type.isSchema) {
              moduleData += `    ${remoteKey}s(obj, args, ctx, info) {
      return ctx.${remoteValue.type.name}.getList(args, info);
    },
`;
            }
          }*/
        }
      }
      replace += `  },
`;
      /*
      if (moduleData !== '') {
        moduleData = `${moduleData.replace(/,\s*$/, '')}
`;
      }

      // override batch resolvers in resolvers.js file
      replaceModuleData = `// related data([^*]+)// end related data`;
      shell
        .ShellString(
          shell
            .cat(resolverFile)
            .replace(RegExp(replaceModuleData, 'g'), `// related data\n${moduleData}    // end related data`)
        )
        .to(resolverFile);*/

      // override batch resolvers in resolvers.js file
      const replaceBatchResolvers = `// schema batch resolvers([^*]+)// end schema batch resolvers`;
      shell
        .ShellString(
          shell
            .cat(resolverFile)
            .replace(
              RegExp(replaceBatchResolvers, 'g'),
              `// schema batch resolvers\n${replace}  // end schema batch resolvers`
            )
        )
        .to(resolverFile);

      logger.info(chalk.green(`✔ Resolver in ${pathSchema}${resolverFile} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ Schema path ${pathSchema} not found!`));
    }

    // get fragment file
    const pathFragment = `${__dirname}/../../packages/client/src/modules/${module}/graphql/`;
    if (fs.existsSync(pathFragment)) {
      const file = `${Module}.graphql`;

      // regenerate graphql fragment
      // TODO: refactor to generate this recursively
      let graphql = '';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        if (value.type.isSchema) {
          let column = 'name';
          for (const remoteKey of value.type.keys()) {
            const remoteValue = value.type.values[remoteKey];
            if (remoteValue.sortBy) {
              column = remoteKey;
            }
          }
          graphql += `  ${key} {\n`;
          graphql += `    id\n`;
          graphql += `    ${column}\n`;
          graphql += `  }\n`;
        } else if (value.type.constructor === Array && value.type[0].isSchema) {
          graphql += `  ${key} {\n`;
          for (const remoteKey of value.type[0].keys()) {
            const remoteValue = value.type[0].values[remoteKey];
            if (remoteValue.type.isSchema) {
              let remotecolumn = 'name';
              for (const remoteKey of remoteValue.type.keys()) {
                const remoteValue1 = remoteValue.type.values[remoteKey];
                if (remoteValue1.sortBy) {
                  remotecolumn = remoteKey;
                }
              }
              graphql += `    ${remoteKey} {\n`;
              graphql += `      id\n`;
              graphql += `      ${remotecolumn}\n`;
              graphql += `    }\n`;
            } else if (remoteValue.type.constructor !== Array) {
              graphql += `    ${remoteKey}\n`;
            }
          }
          graphql += `  }\n`;
        } else {
          graphql += `  ${key}\n`;
        }
      }

      shell.cd(pathFragment);
      // override graphql fragment file
      const replaceFragment = `${Module} {(.|\n)*\n}\n`;
      shell.ShellString(shell.cat(file).replace(RegExp(replaceFragment, 'g'), `${Module} {\n${graphql}}\n`)).to(file);

      logger.info(chalk.green(`✔ Fragment in ${pathFragment}${file} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ Fragment path ${pathFragment} not found!`));
    }
    /*
    // get module query file
    const pathModuleQuery = `${__dirname}/../../packages/client/src/modules/${module}/graphql/`;
    if (fs.existsSync(pathModuleQuery)) {
      const file = `${Module}Query.graphql`;

      // regenerate graphql module query
      let graphql = '';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        if (value.type.isSchema) {
          let column = 'name';
          for (const remoteKey of value.type.keys()) {
            const remoteValue = value.type.values[remoteKey];
            if (remoteValue.sortBy) {
              column = remoteKey;
            }
          }
          graphql += `    ${key}s {\n`;
          graphql += `      id\n`;
          graphql += `      ${column}\n`;
          graphql += `    }\n`;
        } else if (value.type.constructor === Array) {
          for (const remoteKey of value.type[0].keys()) {
            const remoteValue = value.type[0].values[remoteKey];
            if (remoteValue.type.isSchema) {
              let remotecolumn = 'name';
              for (const remoteKey of remoteValue.type.keys()) {
                const remoteValue1 = remoteValue.type.values[remoteKey];
                if (remoteValue1.sortBy) {
                  remotecolumn = remoteKey;
                }
              }
              graphql += `    ${remoteKey}s {\n`;
              graphql += `      id\n`;
              graphql += `      ${remotecolumn}\n`;
              graphql += `    }\n`;
            }
          }
        }
      }

      shell.cd(pathModuleQuery);
      // override graphql module query file
      const replaceFragment = `### form data([^()]+)### end form data`;
      shell
        .ShellString(
          shell.cat(file).replace(RegExp(replaceFragment, 'g'), `### form data\n${graphql}    ### end form data`)
        )
        .to(file);

      logger.info(chalk.green(`✔ Module query in ${pathModuleQuery}${file} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ Module query path ${pathModuleQuery} not found!`));
    }*/

    // get state client file
    const pathStateClient = `${__dirname}/../../packages/client/src/modules/${module}/graphql/`;
    if (fs.existsSync(pathStateClient)) {
      const file = `${Module}State.client.graphql`;

      // regenerate graphql fragment
      let graphql = '';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
        if (value.type.isSchema) {
          graphql += `    ${key}Id\n`;
          /*} else if (value.type.constructor === Array) {
            graphql += `  ${key} {\n`;
            for (const remoteKey of value.type[0].keys()) {
              const remoteValue = value.type[0].values[remoteKey];
              if (remoteValue.type.isSchema) {
                let remotecolumn = 'name';
                for (const remoteKey of remoteValue.type.keys()) {
                  const remoteValue1 = remoteValue.type.values[remoteKey];
                  if (remoteValue1.sortBy) {
                    remotecolumn = remoteKey;
                  }
                }
                graphql += `    ${remoteKey} {\n`;
                graphql += `      id\n`;
                graphql += `      ${remotecolumn}\n`;
                graphql += `    }\n`;
              } else {
                graphql += `    ${remoteKey}\n`;
              }
            }
            graphql += `  }\n`;*/
        } else {
          if (hasTypeOf(Date)) {
            graphql += `    ${key}_lte\n`;
            graphql += `    ${key}_gte\n`;
          } else {
            graphql += `    ${key}\n`;
          }
        }
      }
      graphql += `    searchText
  }\n`;

      shell.cd(pathStateClient);
      // override graphql fragment file
      const replaceStateClient = `filter {(.|\n)*\n}\n`;
      shell.ShellString(shell.cat(file).replace(RegExp(replaceStateClient, 'g'), `filter {\n${graphql}}\n`)).to(file);

      logger.info(chalk.green(`✔ State Client in ${pathStateClient}${file} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ State Client path ${pathStateClient} not found!`));
    }

    // get state resolver file
    const pathStateResolver = `${__dirname}/../../packages/client/src/modules/${module}/resolvers/`;
    if (fs.existsSync(pathStateResolver)) {
      const file = `index.js`;

      // regenerate resolver defaults
      let defaults = `const defaultFilters = {\n`;
      for (const key of schema.keys()) {
        const value = schema.values[key];
        const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
        if (value.type.isSchema) {
          defaults += `  ${key}Id: '',\n`;
          /*} else if (value.type.constructor === Array) {
            graphql += `  ${key} {\n`;
            for (const remoteKey of value.type[0].keys()) {
              const remoteValue = value.type[0].values[remoteKey];
              if (remoteValue.type.isSchema) {
                let remotecolumn = 'name';
                for (const remoteKey of remoteValue.type.keys()) {
                  const remoteValue1 = remoteValue.type.values[remoteKey];
                  if (remoteValue1.sortBy) {
                    remotecolumn = remoteKey;
                  }
                }
                graphql += `    ${remoteKey} {\n`;
                graphql += `      id\n`;
                graphql += `      ${remotecolumn}\n`;
                graphql += `    }\n`;
              } else {
                graphql += `    ${remoteKey}\n`;
              }
            }
            graphql += `  }\n`;*/
        } else {
          if (hasTypeOf(Date)) {
            defaults += `  ${key}_lte: '',\n`;
            defaults += `  ${key}_gte: '',\n`;
          } else {
            defaults += `  ${key}: '',\n`;
          }
        }
      }

      defaults += `  searchText: ''
};\n`;

      shell.cd(pathStateResolver);
      // override state resolver file
      const replaceStateResolverDefaults = `// filter data([^*]+)// end filter data`;
      shell
        .ShellString(
          shell
            .cat(file)
            .replace(RegExp(replaceStateResolverDefaults, 'g'), `// filter data\n${defaults}// end filter data`)
        )
        .to(file);

      logger.info(chalk.green(`✔ State Resolver in ${pathStateResolver}${file} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ State Resolver path ${pathStateResolver} not found!`));
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
  console.log(tablePrefix);
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
