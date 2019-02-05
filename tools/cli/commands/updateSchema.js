const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const GraphQLGenerator = require('@domain-schema/graphql').default;
const { pascalize, camelize } = require('humps');

const { getModulePackageName, computeModulePath, generateField, runPrettier } = require('../helpers/util');
const schemas = require('../../../modules/core/server-ts/generatedSchemas');

/**
 * Update module schema.
 *
 * @param logger - The Logger.
 * @param moduleName - The name of a new module.
 * @param packageName - The location for a new module [client|server|both].
 */
function updateModule({ logger, packageName, moduleName, old }) {
  if (packageName === 'server') {
    logger.info(`Updating ${moduleName} Schema…`);

    // pascalize
    const Module = pascalize(moduleName);
    //const modulePath = `${BASE_PATH}/packages/server/src/modules/${moduleName}`;
    const modulePackageName = getModulePackageName(packageName, old);
    const destinationPath = computeModulePath(modulePackageName, old, moduleName);

    if (fs.existsSync(destinationPath)) {
      // get module schema
      const schema = schemas.default[`${Module}Schema`];

      // schema file
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
          inputFilter += `  ${key}: ${pascalize(value.type[0].name)}FilterInput\n`;
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

      shell.cd(destinationPath);
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

      logger.info(chalk.green(`✔ Schema in ${destinationPath}${file} successfully updated!`));

      const resolverFile = `resolvers.ts`;
      let hasBatchResolvers = false;
      let replace = `  ${schema.name}: {
`;
      for (const key of schema.keys()) {
        const value = schema.values[key];
        if (value.type.constructor === Array) {
          hasBatchResolvers = true;
          const remoteField = value.remoteField ? camelize(value.remoteField) : camelize(schema.name);
          replace += `    ${key}: createBatchResolver((sources, args, ctx, info) => {
      return ctx.${schema.name}.getByIds(sources.map(({ id }) => id), '${remoteField}', ctx.${
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
      runPrettier(resolverFile);

      logger.info(chalk.green(`✔ Resolver in ${destinationPath}${resolverFile} successfully updated!`));
    } else {
      logger.info(chalk.red(`✘ Module ${moduleName} in path ${destinationPath} not found!`));
    }
  }
}

module.exports = updateModule;
