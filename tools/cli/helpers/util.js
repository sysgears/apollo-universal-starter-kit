const shell = require('shelljs');
const fs = require('fs');
const DomainSchema = require('@domain-schema/core').default;
const { pascalize, decamelize } = require('humps');
const { startCase } = require('lodash');

/**
 *
 * @param destinationPath
 * @param templatePath
 * @param module
 * @param location
 */
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

/**
 *
 * @param value
 * @param update
 * @returns {string}
 */
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

/**
 *
 * @param module
 * @param commonGraphqlPath
 * @param moduleGraphqlContainer
 */
function generateCommonGraphqlFile(module, commonGraphqlPath, moduleGraphqlContainer) {
  const importGraphqlContainer = `import ${moduleGraphqlContainer} from '../${module}/containers/${moduleGraphqlContainer}';\n`;
  const exportGraphqlContainer = `\nexport default {\n  ${moduleGraphqlContainer}\n};\n`;

  if (fs.existsSync(commonGraphqlPath)) {
    const commonGraphqlData = fs.readFileSync(commonGraphqlPath);
    const commonGraphql = commonGraphqlData.toString().trim();
    if (commonGraphql.length > 1) {
      const index = commonGraphql.lastIndexOf("';");
      const computedIndex = index >= 0 ? index + 3 : false;
      if (computedIndex) {
        let computedCommonGraphql =
          commonGraphql.slice(0, computedIndex) +
          importGraphqlContainer +
          commonGraphql.slice(computedIndex, commonGraphql.length);
        computedCommonGraphql = computedCommonGraphql.replace(/(,|)\s};/g, `,\n  ${moduleGraphqlContainer}\n};`);
        return fs.writeFileSync(commonGraphqlPath, computedCommonGraphql);
      }
    }
  }
  return fs.writeFileSync(commonGraphqlPath, importGraphqlContainer + exportGraphqlContainer);
}

/**
 *
 * @param module
 * @param commonGraphqlPath
 * @param moduleGraphqlContainer
 */
function deleteModuleFromCommonGraphqlFile(module, commonGraphqlPath, moduleGraphqlContainer) {
  if (fs.existsSync(commonGraphqlPath)) {
    const commonGraphqlData = fs.readFileSync(commonGraphqlPath);
    const reg = `(\\n\\s\\s${moduleGraphqlContainer}(.|)|import ${moduleGraphqlContainer}.+;\\n+(?!ex))`;
    const commonGraphql = commonGraphqlData.toString().replace(new RegExp(reg, 'g'), '');
    fs.writeFileSync(commonGraphqlPath, commonGraphql);
  }
}

module.exports = {
  renameFiles,
  generateField,
  generateCommonGraphqlFile,
  deleteModuleFromCommonGraphqlFile
};
