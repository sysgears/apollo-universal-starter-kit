const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const GraphQLGenerator = require('@domain-schema/graphql').default;
const { pascalize, camelize } = require('humps');

const { BASE_PATH } = require('../config');
const { generateField } = require('../helpers/util');
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
          } else if (key === 'id' || hasTypeOf(String)) {
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
  } else {
    logger.info(chalk.red(`✘ Module ${moduleName} in path ${modulePath} not found!`));
  }
}

module.exports = updateModule;
