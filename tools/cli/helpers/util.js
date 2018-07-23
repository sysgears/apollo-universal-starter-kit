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
 * @param pathToFileWithExports
 * @param exportName
 * @param importString
 */
function updateFileWithExports({ pathToFileWithExports, exportName, importString }) {
  const exportGraphqlContainer = `\nexport default {\n  ${exportName}\n};\n`;

  if (fs.existsSync(pathToFileWithExports)) {
    const generatedContainerData = fs.readFileSync(pathToFileWithExports);
    const generatedContainer = generatedContainerData.toString().trim();
    if (generatedContainer.length > 1) {
      const index = generatedContainer.lastIndexOf("';");
      const computedIndex = index >= 0 ? index + 3 : false;
      if (computedIndex) {
        let computedGeneratedContainer =
          generatedContainer.slice(0, computedIndex) +
          importString +
          generatedContainer.slice(computedIndex, generatedContainer.length);
        computedGeneratedContainer = computedGeneratedContainer.replace(/(,|)\s};/g, `,\n  ${exportName}\n};`);
        return fs.writeFileSync(pathToFileWithExports, computedGeneratedContainer);
      }
    }
  }
  return fs.writeFileSync(pathToFileWithExports, importString + exportGraphqlContainer);
}

/**
 *
 * @param pathToFileWithExports
 * @param exportName
 */
function deleteFromFileWithExports(pathToFileWithExports, exportName) {
  if (fs.existsSync(pathToFileWithExports)) {
    const generatedElementData = fs.readFileSync(pathToFileWithExports);
    const reg = `(\\n\\s\\s${exportName}(.|)|import (${exportName}|{ ${exportName} }).+;\\n+(?!ex))`;
    const generatedElement = generatedElementData.toString().replace(new RegExp(reg, 'g'), '');
    fs.writeFileSync(pathToFileWithExports, generatedElement);
  }
}

module.exports = {
  renameFiles,
  generateField,
  updateFileWithExports,
  deleteFromFileWithExports
};
