const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const GraphQLGenerator = require('@domain-schema/graphql').default;
const { pascalize, camelize } = require('humps');

const { BASE_PATH } = require('../config');
const { generateField, runPrettier } = require('../helpers/util');
const schemas = require('../../../packages/server/src/modules/common/generatedSchemas');

/**
 *
 * @param logger
 * @param moduleName
 * @returns {*|void}
 */
function updateModule(logger, moduleName, location) {
  logger.info(`Updating ${moduleName} Schema…`);
  console.log('location:', location);

  // pascalize
  const Module = pascalize(moduleName);

  const modulePath = `${BASE_PATH}/packages/server/src/modules/${moduleName}`;

  if (fs.existsSync(modulePath)) {
    // get module schema
    const schema = schemas.default[`${Module}Schema`];

    // get schema file
    const pathSchema = `${BASE_PATH}/packages/server/src/modules/${moduleName}/`;
    if (fs.existsSync(pathSchema)) {
      const file = `schema.graphql`;

      // regenerate input fields
      let inputCreate = '';
      let inputUpdate = '';
      let inputFilter = `  searchText: String\n`;
      let manyInput = '';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
        if (value.type.isSchema) {
          let required = value.optional ? '' : '!';
          const id = value.noIdSuffix ? '' : 'Id';
          inputCreate += `  ${key}${id}: Int${required}\n`;
          inputUpdate += `  ${key}${id}: Int\n`;
          inputFilter += `  ${key}${id}: Int\n`;
          inputFilter += `  ${key}${id}_in: [Int!]\n`;
          inputFilter += `  ${key}${id}_contains: Int\n`;
        } else if (value.type.constructor !== Array) {
          if (key !== 'id') {
            inputCreate += `  ${key}: ${generateField(value)}\n`;
            inputUpdate += `  ${key}: ${generateField(value, true)}\n`;
          }

          if (hasTypeOf(Date)) {
            inputFilter += `  ${key}_lte: ${generateField(value, true)}\n`;
            inputFilter += `  ${key}_gte: ${generateField(value, true)}\n`;
          } else if (hasTypeOf(String)) {
            inputFilter += `  ${key}: ${generateField(value, true)}\n`;
            inputFilter += `  ${key}_in: [${generateField(value, true)}!]\n`;
            inputFilter += `  ${key}_contains: ${generateField(value, true)}\n`;
          } else {
            inputFilter += `  ${key}: ${generateField(value, true)}\n`;
          }
        } else if (value.type.constructor === Array && value.type[0].isSchema) {
          inputCreate += `  ${key}: ${pascalize(key)}CreateManyInput\n`;
          inputUpdate += `  ${key}: ${pascalize(key)}UpdateManyInput\n`;

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

      const resolverFile = `resolvers.ts`;
      let hasBatchResolvers = false;
      let replace = `  ${schema.name}: {
`;
      for (const key of schema.keys()) {
        const value = schema.values[key];
        if (value.type.constructor === Array) {
          hasBatchResolvers = true;
          replace += `    ${key}: createBatchResolver((sources, args, ctx, info) => {
      return ctx.${schema.name}.getByIds(sources.map(({ id }) => id), '${camelize(schema.name)}', ctx.${
            value.type[0].name
          }, info);
    }),
`;
        }
      }
      replace += `  },
`;
      replace = hasBatchResolvers ? replace : '';

      // override batch resolvers in resolvers.ts file
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
    const pathFragment = `${BASE_PATH}/packages/client/src/modules/${moduleName}/graphql/`;
    if (fs.existsSync(pathFragment)) {
      const fragmentGraphqlFile = `${Module}.graphql`;

      // regenerate graphql fragment
      let fragmentGraphql = '';
      for (const key of schema.keys()) {
        fragmentGraphql += regenerateGraphqlFragment(schema.values[key], key);
      }

      shell.cd(pathFragment);
      // override graphql fragment file
      const replaceFragment = `${Module} {(.|\n)*\n}`;
      fragmentGraphql = shell
        .cat(fragmentGraphqlFile)
        .replace(RegExp(replaceFragment, 'g'), `${Module} {\n${fragmentGraphql}}`);
      try {
        fs.writeFileSync(pathFragment + fragmentGraphqlFile, fragmentGraphql);
      } catch (err) {
        return logger.error(chalk.red(`✘ Failed to write a ${pathFragment}${fragmentGraphqlFile} file!`));
      }
      logger.info(chalk.green(`✔ Fragment in ${pathFragment}${fragmentGraphqlFile} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ Fragment path ${pathFragment} not found!`));
    }

    // get state client file
    const pathStateClient = `${BASE_PATH}/packages/client/src/modules/${moduleName}/graphql/`;
    if (fs.existsSync(pathStateClient)) {
      const file = `${Module}State.client.graphql`;

      // regenerate graphql fragment
      let graphql = '    searchText,\n';
      for (const key of schema.keys()) {
        const value = schema.values[key];
        const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
        if (value.type.isSchema) {
          const id = value.noIdSuffix ? '' : 'Id';
          graphql += `    ${key}${id}\n`;
        } else {
          if (hasTypeOf(Date)) {
            graphql += `    ${key}_lte\n`;
            graphql += `    ${key}_gte\n`;
          } else if (hasTypeOf(String)) {
            graphql += `    ${key}_contains\n`;
          } else {
            graphql += `    ${key}\n`;
          }
        }
      }
      graphql += `
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
    const pathStateResolver = `${BASE_PATH}/packages/client/src/modules/${moduleName}/resolvers/`;
    if (fs.existsSync(pathStateResolver)) {
      const file = `index.js`;

      // regenerate resolver defaults
      let defaults = `const defaultFilters = {\n`;
      defaults += `searchText: '',\n`;
      for (const key of schema.keys()) {
        const value = schema.values[key];
        const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
        if (value.type.isSchema) {
          const id = value.noIdSuffix ? '' : 'Id';
          defaults += `${key}${id}: '',\n`;
        } else {
          if (hasTypeOf(Date)) {
            defaults += `${key}_lte: '',\n`;
            defaults += `${key}_gte: '',\n`;
          } else if (hasTypeOf(String)) {
            defaults += `${key}_contains: '',\n`;
          } else {
            defaults += `${key}: '',\n`;
          }
        }
      }

      defaults += `};`;

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
      runPrettier(file);

      logger.info(chalk.green(`✔ State Resolver in ${pathStateResolver}${file} successfully updated!`));
    } else {
      logger.error(chalk.red(`✘ State Resolver path ${pathStateResolver} not found!`));
    }
  } else {
    logger.info(chalk.red(`✘ Module ${moduleName} in path ${modulePath} not found!`));
  }
}

const regenerateGraphqlFragment = (value, key, spaces = '') => {
  if (value.type.isSchema) {
    let column = 'name';
    for (const remoteKey of value.type.keys()) {
      const remoteValue = value.type.values[remoteKey];
      if (remoteValue.sortBy) {
        column = remoteKey;
      }
    }
    return `  ${key} {\n    ${spaces}id\n    ${spaces}${column}\n  ${spaces}}\n`;
  } else if (value.type.constructor === Array && value.type[0].isSchema) {
    let str = `  ${key} {\n`;
    for (const remoteKey of value.type[0].keys()) {
      const remoteValue = value.type[0].values[remoteKey];
      if (remoteValue.type.isSchema) {
        str += `  ${regenerateGraphqlFragment(remoteValue, remoteKey, '  ')}`;
      } else if (remoteValue.type.constructor !== Array) {
        str += `    ${remoteKey}\n`;
      }
    }
    return str + `  }\n`;
  } else {
    return `  ${key}\n`;
  }
};

module.exports = updateModule;
