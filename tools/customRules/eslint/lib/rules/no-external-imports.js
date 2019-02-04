/**
 * @fileoverview No exteral imports outside specific module.
 * @author SysGears INC
 */

'use strict';

var path = require('path');
var fs = require('fs');

const DEPENDENCIES_VARIANTS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

function getDependencies(providedPath, moduleDependencies, nodeImport) {
  const dirPath = path.resolve(path.dirname(providedPath));
  const packageJsonPath = findFilesystemEntity(dirPath, 'package.json');
  if (typeof packageJsonPath !== 'undefined') {
    getDependenciesFromPackageJson(packageJsonPath, moduleDependencies);
  }
  checkDependenciesInNodeModules(dirPath, moduleDependencies);

  if (!moduleDependencies.has(nodeImport)) {
    checkDependenciesInNodeModules(path.dirname(dirPath), moduleDependencies);
  }
}

function checkDependenciesInNodeModules(currentFolderPath, packageJsonDependencies) {
  const nodeModulesPath = findFilesystemEntity(currentFolderPath, 'test_node_modules');
  if (typeof nodeModulesPath !== 'undefined') {
    collectNodeModulesDependencies(nodeModulesPath, packageJsonDependencies);
  }
}

function findFilesystemEntity(current, name) {
  let prev;
  do {
    const fileName = path.join(current, name);
    if (fs.existsSync(fileName)) {
      return fileName;
    }
    prev = current;
    current = path.dirname(current);
  } while (prev !== current);
  return undefined;
}

function addDependencies(moduleDependencies, dependencies, moduleSubDependencies) {
  for (const name in dependencies) {
    if (dependencies.hasOwnProperty(name)) {
      if (moduleSubDependencies && name.indexOf('@') === 0) {
        const moduleParts = name.split('/');
        moduleSubDependencies[moduleParts[0]] = moduleParts[1];
      }
      moduleDependencies.add(name);
    }
  }
}
function getDependenciesFromPackageJson(packageJsonPath, moduleDependencies) {
  // don't use require here to avoid caching
  // remove BOM from file content before parsing
  const content = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8').replace(/^\uFEFF/, ''));
  DEPENDENCIES_VARIANTS.forEach(async dependencyVariant => {
    if (typeof content[dependencyVariant] !== 'undefined') {
      addDependencies(moduleDependencies, content[dependencyVariant]);
    }
  });
}

function collectNodeModulesDependencies(currentPath, packageJsonDependencies) {
  const nodeModulesFolders = fs.readdirSync(currentPath);
  for (const moduleFolder of nodeModulesFolders) {
    const stat = fs.lstatSync(path.join(currentPath, moduleFolder));
    if (packageJsonDependencies.has(moduleFolder)) {
      if (stat.isSymbolicLink()) {
        getDependenciesFromPackageJson(path.join(currentPath, moduleFolder, 'package.json'), packageJsonDependencies);
      }
    }
  }
}

function missingErrorMessage(packageName) {
  return `Can't find '${packageName}' in the packages.json or in related module's package.json.`;
}

function reportIfMissing(context, node, moduleDependencies) {
  if (!moduleDependencies.has(node.source.value)) {
    context.report(node, missingErrorMessage(node.source.value));
  }
}
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'No exteral imports outside specific module.',
      category: 'Fill me in',
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const moduleDependencies = new Set();
    getDependencies(context.getFilename(), moduleDependencies);
    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      ImportDeclaration: function(node) {
        reportIfMissing(context, node, moduleDependencies, node.source.value);
      }
    };
  }
};
